
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=1a20ca3e`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; 
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=1a20ca3e`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
        <div class="movie-poster">
            <img src="${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt="movie poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>
            <ul class="movie-misc-info">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Ratings: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
            </ul>
            <p class="genre"><b>Genre:</b> ${details.Genre}</p>
            <p class="writer"><b>Writer:</b> ${details.Writer}</p>
            <p class="actors"><b>Actors: </b>${details.Actors}</p>
            <p class="plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="language"><b>Language:</b> ${details.Language}</p>
            <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
            <button class="add-to-listing" 
                    data-id="${details.imdbID}" 
                    data-title="${details.Title}" 
                    data-year="${details.Year}" 
                    data-writer="${details.Writer}" 
                    data-actors="${details.Actors}" 
                    data-poster="${details.Poster}">Add to Listing</button>
        </div>
    `;
    
    // Get the button element
    const addButton = document.querySelector('.add-to-listing');
    
    // Apply styles to the button
    addButton.style.backgroundColor = '#007bff'; 
    addButton.style.color = '#fff';
    addButton.style.border = 'none'; 
    addButton.style.margin = '20px 20px';
    addButton.style.padding = '10px 20px'; 
    addButton.style.borderRadius = '5px'; 
    addButton.style.cursor = 'pointer'; 
    addButton.style.fontSize = '16px'; 
    
    // Add hover effect
    addButton.addEventListener('mouseover', () => {
        addButton.style.backgroundColor = '#0056b3'; 
    });
    
    // Restore original style on mouseout
    addButton.addEventListener('mouseout', () => {
        addButton.style.backgroundColor = '#007bff'; 
    });

    // Call the function to handle the button click event
    loadAddToListingButton();
}



// Add event listener for the "Add to Listing" button
function loadAddToListingButton() {
    const addButton = document.querySelector('.add-to-listing');
    addButton.addEventListener('click', async () => {
        const movieId = addButton.getAttribute('data-id');
        const title = addButton.getAttribute('data-title');
        const year = addButton.getAttribute('data-year');
        const writer = addButton.getAttribute('data-writer');
        const actors = addButton.getAttribute('data-actors');
        const poster = addButton.getAttribute('data-poster');
        await addMovieToListing(movieId, title, year, writer, actors, poster);
    });
}

async function addMovieToListing(movieId, title, year, writer, actors, poster) {
    try {
        const res = await fetch('/addMovieToListing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ movieId, title, year, writer, actors, poster })
        });
        const data = await res.json();

        console.log(data);
    } catch (error) {
        console.error('Error adding movie to listing:', error);
    }
}





window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});