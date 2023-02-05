/*
WRAPPER FEATURES:

- random jokes
- jokes by category
- jokes by search query
- multiple jokes at once
- api abuse prevention
- do not repeat jokes during a session (optional)
- white list of joke categories
- bad word filter for uncategorized jokes (there are so many)
-----------------------------------------------------------------------------------------------------------------------
PUBLIC VARIABLES:

chuckWrapper.numItems - number of jokes to fetch (default 1)
chuckWrapper.repeat - whether to allow repeat jokes (default false)
chuckWrapper.jokes - array of jokes to display (default [])
chuckWrapper.jokesDiv - div to display jokes in (default null)
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
    this.jokesDiv = document.getElementById("jokes");
    this.caroJoke = document.getElementById("caroJoke");
    this.numerator = document.getElementById("numerator");
    this.denominator = document.getElementById("denominator");
    this.jokeIndex = 0;
    this.jokes = [];                 // array of jokes to display
    this.numItems = 1;               // number of jokes to fetch
    this.repeat = false;             // allow joke repetition during a session
    this._failLimit = 10;            // number of failed attempts to fetch a joke (prevents infinite loop and API abuse)
    this._seenJokes = new Set();     // set of joke ids seen during a session
    this._isGenerating = false;      // whether jokes are currently being generated
    this._includedCategories =       // categories to include in joke generation
        new Set([
          "animal", "career",
          "celebrity", "dev",
          "fashion", "food",
          "history", "money",
          "movie", "music",
          "science", "sport",
          "travel",
        ]);
  }

  // private API calls
  async _fetchJoke() {
    let joke = await fetch("https://api.chucknorris.io/jokes/random");
    return (joke.ok) ? await joke.json() : null;
  }

  async _fetchJokeByCategory(category) {
    let joke = await fetch(`https://api.chucknorris.io/jokes/random?category=${category}`);
    return (joke.ok) ? await joke.json() : null;
  }

  async _fetchJokesByQuery(query) {
    let search = await fetch(`https://api.chucknorris.io/jokes/search?query=${query}`);
    return (search.ok) ? await search.json() : { result: [] };
  }

  _hasExcludedCategory(joke) {
    return joke.categories.length !== 0 &&
        joke.categories.filter(category => this._includedCategories.has(category)).length === 0;
  }

  _hasBadWord(joke) {
    return joke.toLowerCase().split(" ").some(word => {
      return badWords.has(word) || badWords.has(word.replace(/[^a-z]/g, ""))
    });
  }

  // public UI functions
  async getJokes() {
    if (this._isGenerating) return;
    this._isGenerating = true;
    
    this.jokes = [];
    this.jokesDiv.innerHTML = "";
    this.jokesDiv.style.minHeight = Math.min(this.numItems * 10, 70) + "vh";
    let fails = 0;
    this.jokeIndex = 0;
    this.numerator.innerText = 1;

    while (this.jokes.length < this.numItems && fails < this._failLimit) {
      let joke = await this._fetchJoke();
      if (this._hasExcludedCategory(joke) || this._hasBadWord(joke.value) ||
          !this.repeat && this._seenJokes.has(joke.id)) {
        fails += 1;
        continue;
      }
      this._seenJokes.add(joke.id);
      let blockquote = document.createElement("blockquote");
      blockquote.innerText = joke.value;
      blockquote.classList.add("new-joke");
      this.jokes.push(joke.value);
      this.jokesDiv.appendChild(blockquote);
      
      if (this.jokes.length === 1) {
        this.caroJoke.innerHTML = `<a id="prevJoke" onclick="prevJoke()">&#10094;</a>${joke.value}<a id="nextJoke" onclick="nextJoke()">&#10095;</a>`;
      }
      this.denominator.innerText = this.jokes.length;
    }

    if (this.jokes.length === 0) {
      let blockquote = document.createElement("blockquote");
      blockquote.innerText = "No jokes found";
      blockquote.classList.add("new-joke");
      this.jokes.push("No jokes found");
      this.jokesDiv.appendChild(blockquote);
      this.caroJoke.innerText = "No jokes found";
      this.denominator.innerText = this.jokes.length;
    }
    this._isGenerating = false;
  }

  async getJokesByCategory(category) {
    if (this._isGenerating) return;
    this._isGenerating = true;

    this.jokes = [];
    this.jokesDiv.innerHTML = "";
    this.jokesDiv.style.minHeight = Math.min(this.numItems * 10, 70) + "vh";
    let fails = 0;
    this.jokeIndex = 0;
    this.numerator.innerText = 1;

    while (this.jokes.length < this.numItems && fails < this._failLimit) {
      let joke = await this._fetchJokeByCategory(category);
      if (this._hasExcludedCategory(joke) || this._hasBadWord(joke.value) ||
          !this.repeat && this._seenJokes.has(joke.id)) {
        fails += 1;
        continue;
      }
      this._seenJokes.add(joke.id);
      let blockquote = document.createElement("blockquote");
      blockquote.innerText = joke.value;
      blockquote.classList.add("new-joke");
      this.jokes.push(joke.value);
      this.jokesDiv.appendChild(blockquote);

      if (this.jokes.length === 1) {
        this.caroJoke.innerHTML = `<a id="prevJoke" onclick="prevJoke()">&#10094;</a>${joke.value}<a id="nextJoke" onclick="nextJoke()">&#10095;</a>`;
      }
      this.denominator.innerText = this.jokes.length;
    }

    if (this.jokes.length === 0) {
      let blockquote = document.createElement("blockquote");
      blockquote.innerText = "No jokes found";
      blockquote.classList.add("new-joke");
      this.jokes.push("No jokes found");
      this.jokesDiv.appendChild(blockquote);
      this.caroJoke.innerText = "No jokes found";
      this.denominator.innerText = this.jokes.length;
    }
    this._isGenerating = false;
  }

  async getJokesByQuery(query) {
    if (this._isGenerating) return;
    this._isGenerating = true;
    this.jokeIndex = 0;
    this.numerator.innerText = 1;

    query = encodeURIComponent(query.toLowerCase());
    this.jokes = [];
    this.jokesDiv.innerHTML = "";
    this.jokesDiv.style.minHeight = Math.min(this.numItems * 10, 70) + "vh";
    let search = await this._fetchJokesByQuery(query);
    let jokes = search.result;

    this.jokes = jokes.filter(joke => !this._hasExcludedCategory(joke)).map(joke => joke.value);
    this.jokes = this.jokes.filter(joke => !this._hasBadWord(joke));

    if (this.jokes.length === 0) this.jokes.push("No jokes found");
    this.jokes.forEach(joke => {
        let blockquote = document.createElement("blockquote");
        blockquote.innerText = joke;
        blockquote.classList.add("new-joke");
        this.jokesDiv.appendChild(blockquote);
    });
    this.caroJoke.innerHTML = `<a id="prevJoke" onclick="prevJoke()">&#10094;</a>${this.jokes[0]}<a id="nextJoke" onclick="nextJoke()">&#10095;</a>`;
    this.denominator.innerText = this.jokes.length;
    this._isGenerating = false;
  }
}

const chuckWrapper = new ChuckWrapper();  // ChuckWrapper instance for global use for the UI (*do not create another)
