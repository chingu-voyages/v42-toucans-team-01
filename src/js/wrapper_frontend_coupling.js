const searchButton = document.getElementById("search");
const generateButton = document.getElementById("generate");
const categorySelect = document.getElementById("category");
const queryInput = document.getElementById("query");
const jokesDiv = document.getElementById("jokes");
const repeatCheckbox = document.getElementById("repeat");
const numItemsInput = document.getElementById("numItems");

repeatCheckbox.addEventListener("change", () => {
  chuckWrapper.repeat = repeatCheckbox.checked;
});

numItemsInput.addEventListener("change", () => {
  chuckWrapper.numItems = numItemsInput.value;
});

generateButton.addEventListener("click", () => {
  if (categorySelect.value === "all") {
    chuckWrapper.getJokes().then(() => {
      jokesDiv.innerHTML = "";
      chuckWrapper.jokes.forEach(joke => {
        let blockquote = document.createElement("blockquote");
        blockquote.innerText = joke;
        jokesDiv.appendChild(blockquote);
      });
    });
  } else {
    chuckWrapper.getJokesByCategory(categorySelect.value).then(() => {
      jokesDiv.innerHTML = "";
      chuckWrapper.jokes.forEach(joke => {
        let blockquote = document.createElement("blockquote");
        blockquote.innerText = joke;
        jokesDiv.appendChild(blockquote);
      });
    });
  }
});

searchButton.addEventListener("click", () => {
  chuckWrapper.getJokesByQuery(queryInput.value).then(() => {
    jokesDiv.innerHTML = "";
    chuckWrapper.jokes.forEach(joke => {
      let blockquote = document.createElement("blockquote");
      blockquote.innerText = joke;
      jokesDiv.appendChild(blockquote);
    });
  });
});

generateButton.click();