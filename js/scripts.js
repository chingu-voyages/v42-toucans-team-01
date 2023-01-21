const breadcrumbElement = document.getElementById("breadcrumb");
const homeButton = document.getElementById("homeButton");
const toRandomButton = document.getElementById("redirectToRandomSection");
const randomButton = document.getElementById("randomButton");
const teamButton = document.getElementById("teamButton");
const homeSection = document.getElementById("homeSection");
const randomSection = document.getElementById("randomSection");
const jokeSection = document.getElementById("jokeSection");
const teamSection = document.getElementById("teamSection");
const teamFooterButton = document.getElementById("teamFooterButton");


const updateBreadcrumb = (newText) => breadcrumbElement.innerText = newText;

const pages = {
  home: new Set([homeSection]),
  random: new Set([randomSection, jokeSection]),
  search: new Set([jokeSection]),
  team: new Set([teamSection])
}

// adds all pages to make a set of all sections
const allPages = Object.values(pages).reduce((acc, val) => new Set([...acc, ...val]), new Set());

const goToPage = (page) => {
  const pageSections = pages[page];
  updateBreadcrumb(page.toUpperCase());
  allPages.forEach(section => section.style.display = "none");
  pageSections.forEach(section => section.style.display = "block");
}

homeButton.addEventListener("click", () => goToPage("home"));
randomButton.addEventListener("click", () => goToPage("random"));
teamButton.addEventListener("click", () => goToPage("team"));
teamFooterButton.addEventListener("click", () => goToPage("team"));
toRandomButton.addEventListener("click", () => goToPage("random"));
queryInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    goToPage("search");
    getSearchResults();
  }
});

goToPage("home");