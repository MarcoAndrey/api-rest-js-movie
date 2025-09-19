// Migrando a axios
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  Headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: API_KEY,
  },
});

// Utils - reutilizacion y optimizacion de codigo

// movies

function createMovies(movies, container) {
  container.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevas películas

  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    movieContainer.addEventListener("click", () => {
      location.hash = "#movie=" + movie.id;
    });

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
      "src",
      "https://image.tmdb.org/t/p/w300" + movie.poster_path
    );

    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
  });
}

// categories

function createCategories(categories, container) {
  container.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevas categorías

  categories.forEach((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");

    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add("category-title");
    categoryTitle.addEventListener("click", () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    categoryTitle.setAttribute("id", "id" + category.id);

    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

// llamado a las API

// Img movies axios

async function getTrendingMoviesPreview() {
  const { data } = await api("trending/movie/day");
  const movies = data.results;

  createMovies(movies, trendingMoviesPreviewList);
}

// Category list axios
async function getCategoriesPreview() {
  const { data } = await api("genre/movie/list");
  const categories = data.genres;

  createCategories(categories, categoriesPreviewList);
}

async function getMoviesByCategory(id) {
  const { data } = await api("discover/movie", {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results;

  createMovies(movies, genericSection);
}

async function getMoviesBySearch(query) {
  const { data } = await api("search/movie", {
    params: {
      query,
    },
  });
  const movies = data.results;

  createMovies(movies, genericSection);
}

async function getTrendingMovies() {
  const { data } = await api("trending/movie/day");
  const movies = data.results;

  createMovies(movies, genericSection);
}

async function getMovieById(id) {
  const { data: movie } = await api("movie/" + id);

  const movieImgUrl = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
  headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(${movieImgUrl})`;

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movie.genres, movieDetailCategoriesList);

  getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id) {
  const { data } = await api(`movie/${id}/recommendations`);
  const relatedMovies = data.results;

  createMovies(relatedMovies, relatedMoviesContainer);
}

// Img movies conn fetch

// async function getTrendingMoviesPreview() {
//   const res = await fetch(
//     "https://api.themoviedb.org/3/trending/movie/day?api_key=" + API_KEY
//   );
//   const data = await res.json();

//   const movies = data.results;
//   movies.forEach((movie) => {
//     const trendingPreviewMoviesContainer = document.querySelector(
//       "#trendingPreview .trendingPreview-movieList"
//     );

//     const movieContainer = document.createElement("div");
//     movieContainer.classList.add("movie-container");

//     const movieImg = document.createElement("img");
//     movieImg.classList.add("movie-img");
//     movieImg.setAttribute("alt", movie.title);
//     movieImg.setAttribute(
//       "src",
//       "https://image.tmdb.org/t/p/w300" + movie.poster_path
//     );

//     movieContainer.appendChild(movieImg);
//     trendingPreviewMoviesContainer.appendChild(movieContainer);
//   });
// }

// Category List con fetch

// async function getCategoriesPreview() {
//   const res = await fetch(
//     "https://api.themoviedb.org/3/genre/movie/list?api_key=" + API_KEY
//   );
//   const data = await res.json();

//   const categories = data.genres;
//   categories.forEach((category) => {
//     const PreviewCategoriesContainer = document.querySelector(
//       "#categoriesPreview .categoriesPreview-list"
//     );

//     const categoryContainer = document.createElement("div");
//     categoryContainer.classList.add("category-container");

//     const categoryTitle = document.createElement("h3");
//     categoryTitle.classList.add("category-title");
//     categoryTitle.setAttribute("id", "id" + category.id);

//     const categoryTitleText = document.createTextNode(category.name);

//     categoryTitle.appendChild(categoryTitleText);
//     categoryContainer.appendChild(categoryTitle);
//     PreviewCategoriesContainer.appendChild(categoryContainer);
//   });
// }
