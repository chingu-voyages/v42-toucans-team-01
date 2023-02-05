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
const mobileMenu = document.getElementById("top-nav");
const slides = document.getElementsByClassName("mySlides");
const dots = document.getElementsByClassName("dot");
const caroJoke = document.getElementById("caroJoke");
const numerator = document.getElementById("numerator");

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
  mobileMenu.className = "nav-links";
}

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
const prevJoke = () => {
  if (chuckWrapper.jokeIndex > 0) {
    chuckWrapper.jokeIndex--;
  } else {
    chuckWrapper.jokeIndex = chuckWrapper.jokes.length - 1;
  }
  updateJoke();
  numerator.innerText = chuckWrapper.jokeIndex + 1;
};

const nextJoke = () => {
  if (chuckWrapper.jokeIndex < chuckWrapper.jokes.length - 1) {
    chuckWrapper.jokeIndex++;
  } else {
    chuckWrapper.jokeIndex = 0;
  }
  updateJoke();
  numerator.innerText = chuckWrapper.jokeIndex + 1;
};

const updateJoke = () => {
  caroJoke.innerHTML = `<a id="prevJoke" onclick="prevJoke()">&#10094;</a>${chuckWrapper.jokes[chuckWrapper.jokeIndex]}<a id="nextJoke" onclick="nextJoke()">&#10095;</a>`;
}

/*function for responsive navbar menu*/

function responsiveMenu() {
  if (mobileMenu.className === "nav-links") {
    mobileMenu.className += " responsive";
  } else {
    mobileMenu.className = "nav-links";
  }
}

/* function for show corousel */

let slideIndex = 1;
showSlides(slideIndex);

/* next/previous controls */
function plusSlides(number) {
  showSlides(slideIndex += number);
}

/* thumbnail image controls */
function currentSlide(number) {
  showSlides(slideIndex = number);
}

function showSlides(number) {
  let index;
 
  if (number > slides.length) {slideIndex = 1}
  if (number < 1) {slideIndex = slides.length}
  for (index = 0; index < slides.length; index++) {
    slides[index].style.display = "none";
  }
  for (index = 0; index < dots.length; index++) {
    dots[index].className = dots[index].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "flex";
  dots[slideIndex-1].className += " active";
}

goToPage("home");