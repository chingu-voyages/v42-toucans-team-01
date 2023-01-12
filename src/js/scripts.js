const mappingElement = document.getElementById("mapping");
const randomButton = document.getElementById("randomButton");
const teamButton = document.getElementById("teamButton");
const randomSection = document.getElementById("randomSection");
const jokeSection = document.getElementById("jokeSection");
const teamSection = document.getElementById("teamSection");
const teamFooterButton = document.getElementById("teamFooterButton");


const updateMapping = (newMapping) => mappingElement.innerText = newMapping;

const goToRandomPage = () => {
  updateMapping("RANDOM");
  randomSection.style.display = "block";
  teamSection.style.display = "none";
  jokeSection.style.display = "block";
  generateButton.click();
}

const goToSearchPage = () => {
  updateMapping("SEARCH");
  randomSection.style.display = "none";
  teamSection.style.display = "none";
  jokeSection.style.display = "block";
}

const goToTeamPage = () => {
  updateMapping("TEAM");
  randomSection.style.display = "none";
  teamSection.style.display = "block";
  jokeSection.style.display = "none";
}

randomButton.addEventListener("click", goToRandomPage);
teamButton.addEventListener("click", goToTeamPage);
teamFooterButton.addEventListener("click", goToTeamPage);
queryInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    goToSearchPage();
    getSearchResults();
  }
});