const generateButton = document.getElementById("generate");
const categorySelect = document.getElementById("category");
const queryInput = document.getElementById("query");
const repeatCheckbox = document.getElementById("repeat");
const numItemsInput = document.getElementById("numItems");


const getSearchResults = () => chuckWrapper.getJokesByQuery(queryInput.value);
repeatCheckbox.addEventListener("change", () => chuckWrapper.repeat = repeatCheckbox.checked);
numItemsInput.addEventListener("change", () => chuckWrapper.numItems = numItemsInput.value);
generateButton.addEventListener("click", () => (categorySelect.value === "all") ? chuckWrapper.getJokes() : chuckWrapper.getJokesByCategory(categorySelect.value));
generateButton.click();