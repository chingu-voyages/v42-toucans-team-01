const breadcrumbElement = document.getElementById("breadcrumb");
const randomButton = document.getElementById("randomButton");
const teamButton = document.getElementById("teamButton");
const randomSection = document.getElementById("randomSection");
const jokeSection = document.getElementById("jokeSection");
const teamSection = document.getElementById("teamSection");
const teamFooterButton = document.getElementById("teamFooterButton");


const updateBreadcrumb = (newText) => breadcrumbElement.innerText = newText;

const goToRandomPage = () => {
  updateBreadcrumb("RANDOM");
  randomSection.style.display = "block";
  teamSection.style.display = "none";
  jokeSection.style.display = "block";
}

const goToSearchPage = () => {
  updateBreadcrumb("SEARCH");
  randomSection.style.display = "none";
  teamSection.style.display = "none";
  jokeSection.style.display = "block";
}

const goToTeamPage = () => {
  updateBreadcrumb("TEAM");
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

goToSearchPage();