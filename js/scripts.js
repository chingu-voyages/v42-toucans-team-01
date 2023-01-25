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
const categoryOptions = document.getElementById("categoryOptions");

const resizeJokes = () => {
  if (window.innerWidth >= 850 && randomSection.style.display === "block") {
    jokeSection.style.margin = "15px 86px 25px 35px";
  } else if (window.innerWidth < 850) {
    jokeSection.style.margin = "15px 15px 25px 15px";
  } else {
    jokeSection.style.margin = "20px 191px 20px 174px";
  }
}

const selectCategory = (category) => {
  categorySelect.value = category;
  categorySelect.innerText = category;
  categoryOptions.style.height = "0px";
  categoryOptions.style.marginTop = "0";
}

const expandCategoryOptions = () => {
  categoryOptions.style.height = "300px";
  categoryOptions.style.marginTop = "10px";
}

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
  updateBreadcrumb(page.toUpperCase());
  allPages.forEach(section => section.style.display = "none");
  pages[page].forEach(section => section.style.display = "block");
  resizeJokes();
}

window.addEventListener("resize", resizeJokes);
categoryOptions.childNodes.forEach(category => category.addEventListener("click", () => selectCategory(category.value)));
categorySelect.addEventListener("click", expandCategoryOptions);
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
numItemsInput.addEventListener("focusout", () => {
  if (numItemsInput.value < 1) {
    numItemsInput.value = 1;
    chuckWrapper.numItems = 1;
  }
});

goToPage("home");


/*function for responsive navbar menu*/
homeButton.addEventListener("click", () => responsiveMenu());
function responsiveMenu() {
  var mobileMenu = document.getElementById("top-nav");
  if (mobileMenu.className === "nav-links") {
    mobileMenu.className += " responsive";
  } else {
    mobileMenu.className = "nav-links";
  }

  var navBar = document.getElementsByClassName("navbar");
  if (navBar === "navbar") {
    navBar.className += " responsive-nav";
  } else {
    navBar.className = "navbar";
  }
}