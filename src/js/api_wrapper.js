/*
-----------------------------------------------------------------------------------------------------------------------
PUBLIC VARIABLES:

chuckWrapper.numItems - number of jokes to fetch (default 1)
chuckWrapper.repeat - whether to allow repeat jokes (default false)
chuckWrapper.jokes - array of jokes to display (default [])
-----------------------------------------------------------------------------------------------------------------------
PUBLIC METHODS (coroutines):

chuckWrapper.getJokes() - fetches {numItems} of jokes from API and stores them in chuckWrapper.jokes
chuckWrapper.getJokesByCategory(category) - fetches {numItems} of jokes from API with the given category and stores
                                            them in chuckWrapper.jokes
chuckWrapper.getJokesByQuery(query) - fetches all jokes from API that match the given query and stores them in
                                      chuckWrapper.jokes (converts query to uri encoded string)
-----------------------------------------------------------------------------------------------------------------------
EXAMPLE USAGE:

const generateButton = document.getElementById("generateButton");
const jokeList = document.getElementById("jokeList");

generateButton.addEventListener("click", async () => {
  chuckWrapper.getJokes().then(() => {
    chuckWrapper.jokes.forEach(joke => {
      let listItem = document.createElement("li");
      listItem.innerText = joke;
      jokeList.appendChild(listItem);
    });
  });
});
-----------------------------------------------------------------------------------------------------------------------
*/

class ChuckWrapper {
  constructor() {
    this.numItems = 1;               // number of jokes to fetch
    this.repeat = false;             // allow joke repetition during a session
    this.jokes = [];                 // array of jokes to display
    this._failLimit = 10;            // number of failed attempts to fetch a joke (prevents infinite loop and API abuse)
    this._seenJokes = new Set();     // set of joke ids seen during a session
    this._isGenerating = false;      // whether jokes are currently being generated
    this._includedCategories = [     // categories to exclude
      "animal",
      "career",
      "celebrity",
      "dev",
      "fashion",
      "food",
      "history",
      "money",
      "movie",
      "music",
      "science",
      "sport",
      "travel"
    ];
  }

  // private API calls
  async _fetchJoke() {
    let joke = await fetch("https://api.chucknorris.io/jokes/random");
    if (joke.ok) {
      return await joke.json();
    } else {
      return null;
    }
  }

  async _fetchJokeByCategory(category) {
    let joke = await fetch(`https://api.chucknorris.io/jokes/random?category=${category}`);
    if (joke.ok) {
      return await joke.json();
    } else {
      return null;
    }
  }

  async _fetchJokesByQuery(query) {
    let search = await fetch(`https://api.chucknorris.io/jokes/search?query=${query}`);
    if (search.ok) {
      return await search.json();
    } else {
      return { result: [] };  // handled 400 error but no way to hide console error message on a failed fetch
    }
  }

  _hasExcludedCategory(joke) {
    return joke.categories.length !== 0 && joke.categories.filter(category => this._includedCategories.includes(category)).length === 0;
  }

  // public UI functions
  async getJokes() {
    if (this._isGenerating) {
      return;
    }
    this._isGenerating = true;
    this.jokes = [];
    let fails = 0;
    while (this.jokes.length < this.numItems && fails < this._failLimit) {
      let joke = await this._fetchJoke();
      if (this._hasExcludedCategory(joke) || !this.repeat && this._seenJokes.has(joke.id) || joke === null) {
        fails += 1;
        continue;
      }
      this._seenJokes.add(joke.id);
      this.jokes.push(joke.value);
    }
    if (this.jokes.length === 0) {
      this.jokes.push("No jokes found");
    }
    this._isGenerating = false;
  }

  async getJokesByCategory(category) {
    if (this._isGenerating) {
      return;
    }
    this._isGenerating = true;
    this.jokes = [];
    let fails = 0;
    while (this.jokes.length < this.numItems && fails < this._failLimit) {
      let joke = await this._fetchJokeByCategory(category);
      if (this._hasExcludedCategory(joke) || !this.repeat && this._seenJokes.has(joke.id) || joke === null) {
        fails += 1;
        continue;
      }
      this._seenJokes.add(joke.id);
      this.jokes.push(joke.value);
    }
    if (this.jokes.length === 0) {
      this.jokes.push("No jokes found");
    }
    this._isGenerating = false;
  }

  async getJokesByQuery(query) {
    if (this._isGenerating) {
      return;
    }
    this._isGenerating = true;
    query = encodeURIComponent(query.toLowerCase());
    this.jokes = [];
    let search = await this._fetchJokesByQuery(query);
    let jokes = search.result;
    jokes.filter(joke => !this._hasExcludedCategory(joke));
    this.jokes = jokes.map(joke => joke.value);
    if (this.jokes.length === 0) {
      this.jokes.push("No jokes found");
    }
    this._isGenerating = false;
  }
}

const chuckWrapper = new ChuckWrapper();  // ChuckWrapper instance for global use for the UI (*do not create another)
