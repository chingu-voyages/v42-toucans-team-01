const breadcrumbElement = document.getElementById("breadcrumb");
const homeButton = document.getElementById("homeButton");
const ToRandomButton = document.getElementById("redirectToRandomSection");
const randomButton = document.getElementById("randomButton");
const teamButton = document.getElementById("teamButton");
const homeSection = document.getElementById("homeSection");
const randomSection = document.getElementById("randomSection");
const jokeSection = document.getElementById("jokeSection");
const teamSection = document.getElementById("teamSection");
const teamFooterButton = document.getElementById("teamFooterButton");


const updateBreadcrumb = (newText) => breadcrumbElement.innerText = newText;

const goToHomePage = () => {
  updateBreadcrumb("HOME");
  homeSection.style.display = "block";
  randomSection.style.display = "none";
  teamSection.style.display = "none";
  jokeSection.style.display = "none";
}

const goToRandomPage = () => {
  updateBreadcrumb("RANDOM");
  homeSection.style.display = "none";
  randomSection.style.display = "block";
  teamSection.style.display = "none";
  jokeSection.style.display = "block";
}

const goToSearchPage = () => {
  updateBreadcrumb("SEARCH");
  homeSection.style.display = "none";
  randomSection.style.display = "none";
  teamSection.style.display = "none";
  jokeSection.style.display = "block";
}

const goToTeamPage = () => {
  updateBreadcrumb("TEAM");
  homeSection.style.display = "none";
  randomSection.style.display = "none";
  teamSection.style.display = "block";
  jokeSection.style.display = "none";
}

homeButton.addEventListener("click", goToHomePage);
randomButton.addEventListener("click", goToRandomPage);
teamButton.addEventListener("click", goToTeamPage);
teamFooterButton.addEventListener("click", goToTeamPage);
ToRandomButton.addEventListener("click", goToRandomPage);
queryInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    goToSearchPage();
    getSearchResults();
  }
});

goToHomePage();