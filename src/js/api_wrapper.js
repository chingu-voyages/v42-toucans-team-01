class ChuckWrapper {
  constructor() {
    this.numItems = 1;
    this.repeat = false;
    this.seenJokes = new Set();
    this.currentJokes = [];
    this.categories = [];
  }

  async fetchCategories() {
    let categories = await fetch("https://api.chucknorris.io/jokes/categories");
    this.categories = await categories.json();
  }

  async fetchJoke() {
    let joke = await fetch("https://api.chucknorris.io/jokes/random");
    return await joke.json();
  }

  async fetchJokeByCategory(category) {
    let joke = await fetch(`https://api.chucknorris.io/jokes/random?category=${category}`);
    return await joke.json();
  }

  async fetchJokeByQuery(query) {
    query = query.replace(" ", "+").toLowerCase();
    let search = await fetch(`https://api.chucknorris.io/jokes/search?query=${query}`);
    return await search.json();
  }

  async getJokes() {
    this.currentJokes = [];
    while (this.currentJokes.length < this.numItems) {
      let joke = await this.fetchJoke();
      if (!this.seenJokes.has(joke.id) || this.repeat) {
        this.seenJokes.add(joke.id);
        this.currentJokes.push(joke.value);
      }
    }
  }

  async getJokesByCategory(category) {
    this.currentJokes = [];
    while (this.currentJokes.length < this.numItems) {
      let joke = await this.fetchJokeByCategory(category);
      if (!this.seenJokes.has(joke.id) || this.repeat) {
        this.seenJokes.add(joke.id);
        this.currentJokes.push(joke.value);
      }
    }
  }

  async getJokesByQuery(query) {
    this.currentJokes = [];
    let search = await this.fetchJokeByQuery(query);
    let jokes = search.result;
    for (let i = 0; i < jokes.length; i++) {
      this.currentJokes.push(jokes[i].value);
    }
  }
}
