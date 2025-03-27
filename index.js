// API KEY: 6aa5e9fe
// INIT
const inputSearch = document.getElementById('input-search')
const searchBtn = document.getElementById('search-btn')
const movieListContainer = document.getElementById('movie-list-container')
const watchlistCountEl = document.getElementById('watchlist-count')
let watchlistMoviesInLocalStorage = JSON.parse(localStorage.getItem('watchlist')) || []
let movieArr = []
let watchlistCount = 0

// FUNCTION TO SET ITEMS/UPDATE LOCAL STORAGE
function setItemsInLocalStorage(){
    localStorage.setItem('watchlist', JSON.stringify(watchlistMoviesInLocalStorage))
}


//  //   // THESE CODE RUNS WEHN USER IS ONLY ON INDEX.HTML PAGE
document.addEventListener('DOMContentLoaded', function(){
    const currentPage = window.location.pathname
    // CHECK THE CURRENT PAGE USER IS ON

    // CHECK FOR BOTH DEFAULT HOME PAGE AND CURRENT PAGE
    if(currentPage === '/' || currentPage.includes('/index.html')){

    // RUN THESE CODE IF USER IS ONLY ON MAIN PAGE OR THE INDEX.HTML PAGE
    searchBtn.addEventListener('click', handleSearch)
    inputSearch.addEventListener('input', handleDisabledBtn)


    // FUNCTION TO FETCH DATA OPEN MOVIE API
    function handleSearch(){
        let inputSearchValue = inputSearch.value
            // FETCH DATA FROM OPEN MOVIE API
            fetch(`https://www.omdbapi.com/?t=${inputSearchValue}&apikey=6aa5e9fe`)
            .then(response => response.json())
            .then(data => {
                // CHECK IF MOVIE IS ON OPEN OMAPI
                if(data.Response === 'True') {
                    // PUSH MOVIE OBJECT TO MOVIE ARRAY
                    movieArr.unshift(data)
                    // RENDER MOVIES IN UI
                    renderMovies()
                
                    // CLEAR SEARCH INPPUT
                    toClearinputSearch()
                    
                    
                } else {
                    toClearinputSearch()
                    movieListContainer.innerHTML = `<p class="error-message">Unable to find what you're looking for. Please try another search.</p>`
                }  
            })
    }

    // FUNCTION TO RENDER MOVES
    function renderMovies(){
        let htmlStr = ""
        movieArr.map(function(movie){
            htmlStr += ` 
        <div class="movie-container">
            <img src="${movie.Poster}">
            <div class="movie-desc-container">
                <div class="movie-desc">
                    <h3 class="movie-title">${movie.Title}</h3>
                    <div class="icon-rating-container">
                        <i class="fa-solid fa-star"></i>
                        <p class="movie-rating">${movie.imdbRating}</p> 
                    </div>
                </div>
                <div class="runtime-genre-container">
                    <p class="movie-runtime" >${movie.Runtime}</p>
                    <p class="movie-genre">${movie.Genre}</p>
                    <div class="add-btn-container">
                        <i class="fa-solid fa-circle-plus add-watchlist-btn" data-movie-id=${movie.imdbID}></i>
                        <p class="watchlist">Watchlist</p> 
                    </div>
                </div>
                <p class="movie-plot">${movie.Plot}</p>
            </div>
        </div>`
        }).join('')

        // DISPLAY MOVIE IN UI
        movieListContainer.innerHTML = htmlStr
    }


     // FUNCTION TO CLEAR SEARCH INPUT 
     function toClearinputSearch(){
        inputSearch.value = ""
    }


    // MOVIE LIST EVENTLISTENER THAT FINDS THE MOVIE THAT MATCHES THE MOVIE ID IN THE DATASET AND PUSHES IT INTO WATCHLIST ARRAY
    movieListContainer.addEventListener('click', function(e){
        if(e.target.classList.contains('add-watchlist-btn')){
            // PREVENTING EVENTLISTENER FROM REACHING PARENT ELEMENT
            e.stopPropagation()
            const movieId = e.target.dataset.movieId
            // FINDING MOVIES THAT MATCHES THE DATA SET ID ASSIGN TO IT
            const selectedMovie = movieArr.find(movies => movies.imdbID === movieId)
            if(selectedMovie){
                // CHECK IF MOVIE ALREADY EXIST IN WISHLIST MOVIE ARRAY
                const alreadyExistedMovie = watchlistMoviesInLocalStorage.some(existingMovie => existingMovie.imdbID === selectedMovie.imdbID)
                if(alreadyExistedMovie) {
                   alert('Movie has already been added')
                } else {
                    // PUSH SELECTED MOVIE OBJECT TO WATCHLIST IN WATCHLIST MOVIES IN LOCAL STORAGE ARRAY
                    watchlistMoviesInLocalStorage.unshift(selectedMovie)
                    // UPDATE LOCAL STORAGE
                    setItemsInLocalStorage()
                    // UPDATE WATCHLIST COUNT
                    UpdateWatchlistCount()
                }
            }
        }
    })

    // FUCNTION TO ENABLE SEARCH BTN WHEN USER ENTERS ANYTHING OTHER THAN SPACE
    function handleDisabledBtn(){
        if(inputSearch.value.trim()) {
            searchBtn.disabled = false
        } else {
            searchBtn.disabled = true
        }
    }


    // FUNCTION TO UPDATE COUNT BASE ON THE LENGTH OF THE ARRAY IN LOCAL STORAGE
    function UpdateWatchlistCount(){
        watchlistCount = watchlistMoviesInLocalStorage.length;
        // HIDE WATCHLIST ELEMENT CONTENT IF WATCHLIST IS 0
        watchlistCountEl.textContent = watchlistCount > 0 ? watchlistCount : '';
    }  
    UpdateWatchlistCount()



//  //   // THESE CODE RUNS WHEN USER IS ONLY ON WATCHLIST.HTML PAGE
    } else if (currentPage.includes('/watchlist.html')) {
        
        const watchlistContainer = document.getElementById('watchlist-container')

        // FUNCTION TO RENDER WATCHLIST MOVIES
        function renderWatchlistMovies(){
            let htmlStr = ""
            watchlistMoviesInLocalStorage.map(function(watchlistMovie){
                htmlStr += ` 
            <div class="movie-container">
                <img src="${watchlistMovie.Poster}">
                <div class="movie-desc-container">
                    <div class="movie-desc">
                        <h3 class="movie-title">${watchlistMovie.Title}</h3>
                        <div class="icon-rating-container">
                            <i class="fa-solid fa-star"></i>
                            <p class="movie-rating">${watchlistMovie.imdbRating}</p> 
                        </div>
                    </div>
                    <div class="runtime-genre-container">
                        <p class="movie-runtime">${watchlistMovie.Runtime}</p>
                        <p class="movie-genre">${watchlistMovie.Genre}</p>
                        <div class="remove-btn-container">
                            <i class="fa-solid fa-circle-minus remove-watchlist-btn" data-movie-id=${watchlistMovie.imdbID}></i>
                            <p class="remove">Remove</p> 
                        </div>
                    </div>
                    <p class="movie-plot">${watchlistMovie.Plot}</p>
                </div>
            </div>`
            }).join('')

            
            // DISPLAY MOVIE IN UI
            watchlistContainer.innerHTML = htmlStr
        }
     

         // RENDER ONLY IF THERE ARE ITEMS IN LOCAL STORAGE
        if(watchlistMoviesInLocalStorage.length !== 0){
                renderWatchlistMovies()
        }

        // WATCHLIST EVENTLISTENER TO REMOVE ITEMS FROM LOCALSTORAGE
        watchlistContainer.addEventListener('click', function(e){
           if(e.target.classList.contains('remove-watchlist-btn')) {
            // PREVENT EVENTLISTENER FROM REACHING WATCHLIST CONTAINER
            e.stopPropagation()
            // GET MOVIE ID
            const watchlistMovieId = e.target.dataset.movieId
            // FIND THE INDEX OF THE WATCHLIST THAT MATCHES THE MOVIE ID IN THE LOCAL SOTRAGE
            const indexOfWatchlist = watchlistMoviesInLocalStorage.findIndex(watchlistMovie => watchlistMovie.imdbID === watchlistMovieId)
            // FIND INDEX METHOD RETURNS -1 IF THERES NOTHING IN THE ARRAY
            // CHECK IF THE ARRAY HAS AN ITEM
            if(indexOfWatchlist !== -1){
                // CHECK THE LOCAL STORAGE FOR THE INDEX OF THE SELECTED ITEM AND REMOVE IT
                watchlistMoviesInLocalStorage.splice(indexOfWatchlist, 1)

               
                // UPDATE LOCAL STORAGE
                setItemsInLocalStorage()
                // RE-RENDER UI
                renderWatchlistMovies()

                // DELETE ARRAY FROM LOCAL STORAGE IF THERE'S NOTHING IN IT AND UPDATE UI TO DEFAULT
                if(watchlistMoviesInLocalStorage.length === 0){
                    localStorage.removeItem('watchlist')
                    watchlistContainer.innerHTML = ` 
                    <p class="empty-watchlist-text">Your watchlist is looking a little empty...</p>
                    <div class="add-icon-container">
                        <a href="index.html"><i class="fa-solid fa-circle-plus"></i></a>
                        <p class="add-movies-text">Let’s add some movies!</p>
                    </div>`
                }

            }
           }
        }) 
    }
})







