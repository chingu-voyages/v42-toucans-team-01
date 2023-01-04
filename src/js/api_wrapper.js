/*
-----------------------------------------------------------------------------------------------------------------------
PUBLIC VARIABLES:

chuckWrapper.numItems - number of jokes to fetch (default 1)
chuckWrapper.repeat - whether to allow repeat jokes (default false)
chuckWrapper.categories - array of joke categories (empty until getCategories() is called and awaited) (default [])
chuckWrapper.currentJokes - array of jokes to display (default [])
-----------------------------------------------------------------------------------------------------------------------
PUBLIC METHODS (coroutines):

chuckWrapper.getCategories() - fetches categories from API and stores them in chuckWrapper.categories
chuckWrapper.getJokes() - fetches {numItems} of jokes from API and stores them in chuckWrapper.currentJokes
chuckWrapper.getJokesByCategory(category) - fetches {numItems} of jokes from API with the given category and stores
                                            them in chuckWrapper.currentJokes
chuckWrapper.getJokesByQuery(query) - fetches all jokes from API that match the given query and stores them in
                                      chuckWrapper.currentJokes (converts query to uri encoded string)
-----------------------------------------------------------------------------------------------------------------------
EXAMPLE USAGE:

const categories = document.getElementById("categorySelect");

chuckWrapper.getCategories().then(() => {
  chuckWrapper.categories.forEach(category => {
    let option = document.createElement("option");
    option.value = category;
    option.innerText = category;
    categories.appendChild(option);
  });
});
-----------------------------------------------------------------------------------------------------------------------
*/

class ChuckWrapper {
  constructor() {
    this.numItems = 1;            // number of jokes to fetch
    this.repeat = false;          // allow joke repetition during a session
    this.currentJokes = [];       // array of jokes to display
    this.categories = [];         // array of joke categories
    this._failLimit = 10;         // number of failed attempts to fetch a joke (prevents infinite loop and API abuse)
    this._seenJokes = new Set();  // set of joke ids seen during a session
    this._isGenerating = false;   // whether jokes are currently being generated
  }

  // private API calls
  async _fetchCategories() {
    let categories = await fetch("https://api.chucknorris.io/jokes/categories");
    this.categories = await categories.json();
  }

  async _fetchJoke() {
    let joke = await fetch("https://api.chucknorris.io/jokes/random");
    return await joke.json();
  }

  async _fetchJokeByCategory(category) {
    let joke = await fetch(`https://api.chucknorris.io/jokes/random?category=${category}`);
    return await joke.json();
  }

  async _fetchJokeByQuery(query) {
    let search = await fetch(`https://api.chucknorris.io/jokes/search?query=${query}`);
    if (search.ok) {
      return await search.json();
    } else {
      return { result: [] };  // handled 400 error but no way to hide console error message on a failed fetch
    }
  }

  // public UI methods
  async getCategories() {
    await this._fetchCategories();
  }

  async getJokes() {
    if (this._isGenerating) return;
    this._isGenerating = true;
    this.currentJokes = [];
    let fails = 0;
    while (this.currentJokes.length < this.numItems && fails < this._failLimit) {
      let joke = await this._fetchJoke();
      if (!this._seenJokes.has(joke.id) || this.repeat) {
        this._seenJokes.add(joke.id);
        this.currentJokes.push(joke.value);
      } else {
        fails += 1;
      }
      if (this.currentJokes.length === 0) {
        this.currentJokes.push("No jokes found");
      }
    }
    this._isGenerating = false;
  }

  async getJokesByCategory(category) {
    if (this._isGenerating) return;
    this._isGenerating = true;
    this.currentJokes = [];
    let fails = 0;
    while (this.currentJokes.length < this.numItems && fails < this._failLimit) {
      let joke = await this._fetchJokeByCategory(category);
      if (!this._seenJokes.has(joke.id) || this.repeat) {
        this._seenJokes.add(joke.id);
        this.currentJokes.push(joke.value);
      } else {
        fails += 1;
      }
      if (this.currentJokes.length === 0) {
        this.currentJokes.push("No jokes found");
      }
    }
    this._isGenerating = false;
  }

  async getJokesByQuery(query) {
    if (this._isGenerating) return;
    this._isGenerating = true;
    query = encodeURIComponent(query.toLowerCase());
    this.currentJokes = [];
    let search = await this._fetchJokeByQuery(query);
    let jokes = search.result;
    if (jokes.length > 0) {
      jokes.forEach(joke => {
        this.currentJokes.push(joke.value);
      });
    } else {
      this.currentJokes.push("No jokes found");
    }
    this._isGenerating = false;
  }
}

const chuckWrapper = new ChuckWrapper();  // ChuckWrapper instance for global use for the UI (*do not create another)
