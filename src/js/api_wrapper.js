class ChuckWrapper {
  constructor() {
    this.numItems = 1;
    this.repeat = false;
    this.currentJokes = [];
    this.categories = [];
    this._seenJokes = new Set();
  }

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

  async getCategories() {
    await this._fetchCategories();
  }

  async getJokes() {
    this.currentJokes = [];
    while (this.currentJokes.length < this.numItems) {
      let joke = await this._fetchJoke();
      if (!this._seenJokes.has(joke.id) || this.repeat) {
        this._seenJokes.add(joke.id);
        this.currentJokes.push(joke.value);
      }
    }
  }

  async getJokesByCategory(category) {
    this.currentJokes = [];
    while (this.currentJokes.length < this.numItems) {
      let joke = await this._fetchJokeByCategory(category);
      if (!this._seenJokes.has(joke.id) || this.repeat) {
        this._seenJokes.add(joke.id);
        this.currentJokes.push(joke.value);
      }
    }
  }

  async getJokesByQuery(query) {
    this.currentJokes = [];
    let search = await this._fetchJokeByQuery(query);
    let jokes = search.result;
    for (let i = 0; i < jokes.length; i++) {
      this.currentJokes.push(jokes[i].value);
    }
  }
}
