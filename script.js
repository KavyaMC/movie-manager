const movieList = document.getElementById("movie-list");
const movieForm = document.getElementById("movie-form");
const titleInput = document.getElementById("title-input");
const directorInput = document.getElementById("director-input");
const yearInput = document.getElementById("year-input");
const genreInput = document.getElementById("genre-input");
const ratingInput = document.getElementById("rating-input");
const searchInput = document.getElementById("search-input");
const sortTitleButton = document.getElementById("sort-title");
const sortYearButton = document.getElementById("sort-year");
const sortRatingButton = document.getElementById("sort-rating");
const showAllButton = document.getElementById("show-all");
const showWatchedButton = document.getElementById("show-watched");
const showUnwatchedButton = document.getElementById("show-unwatched");
const totalCount = document.getElementById("total-count");
const watchedCount = document.getElementById("watched-count");
const unwatchedCount = document.getElementById("unwatched-count");
const status = document.getElementById("status");
let movies = [];
let nextID = 0;
function generateID() {
    nextID++;
    return nextID;
}
function createMovie(movie) {
    const movieListItem = document.createElement("li");
    movieListItem.classList.add("list-group-item");
    movieListItem.dataset.id = movie.id;

    const movieTitle = document.createElement("span");
    movieTitle.classList.add("title");
    movieTitle.textContent = movie.title;

    const movieDirector = document.createElement("span");
    movieDirector.classList.add("director");
    movieDirector.textContent = movie.director;

    const productionYear = document.createElement("span");
    productionYear.classList.add("year");
    productionYear.textContent = movie.year;

    const movieCategory = document.createElement("span");
    movieCategory.classList.add("genre");
    movieCategory.textContent = movie.category;

    const rating = document.createElement("span");
    rating.classList.add("rating");
    rating.textContent = movie.rating;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.classList.add(
        "delete-btn",
        "btn",
        "btn-sm",
        "btn-danger"
    );

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox");
    checkbox.checked = movie.watched;

    checkbox.setAttribute(
        "aria-label",
        `Mark ${movie.title} as watched`
    );

    movieListItem.append(
        checkbox,
        document.createTextNode(" "),
        movieTitle,
        document.createTextNode(" | "),
        movieDirector,
        document.createTextNode(" | "),
        productionYear,
        document.createTextNode(" | "),
        movieCategory,
        document.createTextNode(" | "),
        rating,
        document.createTextNode(" "),
        deleteButton
    );

    return movieListItem;
}
function renderMovies(movieArray) {
    movieList.replaceChildren();

    for (const movie of movieArray) {
        movieList.append(createMovie(movie));
    }

    updateStatistics();
}
function updateStatistics() {
    const totalMovies = movies.length;
    let watchedMovies = 0;

    for (const movie of movies) {
        if (movie.watched) {
            watchedMovies++;
        }
    }

    const unwatchedMovies = totalMovies - watchedMovies;

    totalCount.textContent = totalMovies;
    watchedCount.textContent = watchedMovies;
    unwatchedCount.textContent = unwatchedMovies;
}
function handleAddMovie(event) {
    event.preventDefault();

    const title = titleInput.value.trim();

    if (!title) {
        titleInput.focus();
        announce("Please enter a movie title.");
        return;
    }

    const movie = {
        id: generateID(),
        title: title,
        director: directorInput.value.trim(),
        year: parseInt(yearInput.value),
        category: genreInput.value.trim(),
        rating: parseFloat(ratingInput.value),
        watched: false
    };

    movies.push(movie);
    renderMovies(movies);

    announce(`${movie.title} was added to your collection.`);

    titleInput.value = "";
    directorInput.value = "";
    yearInput.value = "";
    genreInput.value = "";
    ratingInput.value = "";

    titleInput.focus();
}
function handleMovieClick(event) {
    const target = event.target;
    const parent = target.parentElement;

    if (!parent || !parent.dataset.id) {
        return;
    }

    const id = Number(parent.dataset.id);

    const movie = movies.find(function (movie) {
        return movie.id === id;
    });

    if (!movie) {
        return;
    }

    if (target.classList.contains("delete-btn")) {
        movies = movies.filter(function (movie) {
            return movie.id !== id;
        });

        renderMovies(movies);
        announce(`${movie.title} was deleted from your collection.`);
        return;
    }

    if (target.classList.contains("checkbox")) {
        movie.watched = target.checked;
        updateStatistics();

        if (movie.watched) {
            announce(`${movie.title} marked as watched.`);
        }
        else {
            announce(`${movie.title} marked as unwatched.`);
        }
    }
}
function enableMovieEditing(event) {
    const target = event.target;

    if (!target.classList.contains("title")) {
        return;
    }

    target.contentEditable = "true";
    target.focus();

    const selection = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(target);
    selection.removeAllRanges();
    selection.addRange(range);
}
function finishMovieEditing(event) {
    const target = event.target;

    if (!target.classList.contains("title")) {
        return;
    }

    target.contentEditable = "false";

    let newTitle = target.textContent.trim();

    if (!newTitle) {
        newTitle = "Untitled Movie";
    }

    const id = Number(target.parentElement.dataset.id);

    const movie = movies.find(function (movie) {
        return movie.id === id;
    });

    if (!movie) {
        return;
    }

    movie.title = newTitle;
    renderMovies(movies);

    announce(`Movie title changed to ${newTitle}.`);
}
function handleEditKey(event) {
    if (event.key.toLowerCase() === "enter") {
        event.preventDefault();
        finishMovieEditing(event);
        event.target.blur();
    }
}
function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const searchedMovies = movies.filter(function (movie) {
        return (
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.director.toLowerCase().includes(searchTerm)
        );
    });

    renderMovies(searchedMovies);
}
function sortMoviesBy(field) {
    if (field === "title") {
        movies.sort(function (a, b) {
            return a.title.localeCompare(b.title);
        });
    }
    else if (field === "year") {
        movies.sort(function (a, b) {
            return a.year - b.year;
        });
    }
    else if (field === "rating") {
        movies.sort(function (a, b) {
            return b.rating - a.rating;
        });
    }

    renderMovies(movies);
}
function filterMoviesBy(filter) {
    if (filter === "all") {
        renderMovies(movies);
    }
    else if (filter === "watched") {
        renderMovies(
            movies.filter(function (movie) {
                return movie.watched;
            })
        );
    }
    else if (filter === "unwatched") {
        renderMovies(
            movies.filter(function (movie) {
                return !movie.watched;
            })
        );
    }
}
function announce(message) {
    status.textContent = "";

    setTimeout(function () {
        status.textContent = message;
    }, 10);
}
function updateSortState(selectedButton) {
    const sortButtons = [
        sortTitleButton,
        sortYearButton,
        sortRatingButton
    ];

    for (const button of sortButtons) {
        button.setAttribute(
            "aria-pressed",
            button === selectedButton
        );
    }
}
function updateFilterState(selectedButton) {
    const filterButtons = [
        showAllButton,
        showWatchedButton,
        showUnwatchedButton
    ];

    for (const button of filterButtons) {
        button.setAttribute(
            "aria-pressed",
            button === selectedButton
        );
    }
}
function handleSortTitle() {
    sortMoviesBy("title");
    updateSortState(sortTitleButton);
    announce("Movies sorted by title.");
}
function handleSortYear() {
    sortMoviesBy("year");
    updateSortState(sortYearButton);
    announce("Movies sorted by year.");
}
function handleSortRating() {
    sortMoviesBy("rating");
    updateSortState(sortRatingButton);
    announce("Movies sorted by rating.");
}
function handleShowAll() {
    filterMoviesBy("all");
    updateFilterState(showAllButton);
    announce("Showing all movies.");
}
function handleShowWatched() {
    filterMoviesBy("watched");
    updateFilterState(showWatchedButton);
    announce("Showing watched movies.");
}
function handleShowUnwatched() {
    filterMoviesBy("unwatched");
    updateFilterState(showUnwatchedButton);
    announce("Showing unwatched movies.");
}
function setupFormListener() {
    movieForm.addEventListener("submit", handleAddMovie);
}
function setupMovieListListener() {
    movieList.addEventListener("click", handleMovieClick);
}
function setupEditListeners() {
    movieList.addEventListener("dblclick", enableMovieEditing);
    movieList.addEventListener("blur", finishMovieEditing, true);
    movieList.addEventListener("keydown", handleEditKey);
}
function setupSearchListener() {
    searchInput.addEventListener("input", handleSearch);
}
function setupSortButtons() {
    sortTitleButton.addEventListener("click", handleSortTitle);
    sortYearButton.addEventListener("click", handleSortYear);
    sortRatingButton.addEventListener("click", handleSortRating);
}
function setupFilterButtons() {
    showAllButton.addEventListener("click", handleShowAll);
    showWatchedButton.addEventListener("click", handleShowWatched);
    showUnwatchedButton.addEventListener("click", handleShowUnwatched);
}
function bootSystem() {
    setupFormListener();
    setupMovieListListener();
    setupEditListeners();
    setupSearchListener();
    setupSortButtons();
    setupFilterButtons();
}
document.addEventListener("DOMContentLoaded", bootSystem);