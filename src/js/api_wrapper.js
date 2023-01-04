class ChuckWrapper {
  constructor() {
    this.numItems = 1;
    this.repeat = false;
    this.currentJokes = [];
    this.categories = [];
    this._failLimit = 10;
    this._seenJokes = new Set();
    this._isGenerating = false;
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