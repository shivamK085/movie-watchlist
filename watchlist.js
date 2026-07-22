const movieCards = document.getElementById('movies-container')
const origHtml = movieCards.innerHTML
let movieCardsHtml = ""

let movieData = JSON.parse(localStorage.getItem('userData'))
// console.log("movie data: ", movieData)

function renderMovieList(){
    if(movieCardsHtml.length > 0){
        movieCards.innerHTML = movieCardsHtml
    }
}


function createMovieCardsHtml(){
    movieCardsHtml = ""
    if(movieData.length > 0) {

        for(let data of movieData){
            movieCardsHtml += `
                <div class="movie-card">
                    <img src="${data.Poster}" class="poster-img">
        
                    <div class="movie-meta">
                        <div class="card-top">
                            <h2>${data.Title}</h2>
                            <img src="star-icon.svg" alt="icon of a yellow star" class="star-icon">
                            <span>${data.imdbRating}</span>
                        </div>
                        <div class="movie-meta-inner">
                            <span>${data.Runtime}</span>
                            <span>${data.Genre}</span>
                            <button class="watchlist-btn" data-movie="${data.imdbID}">
                                <img src="remove-icon.svg" class="watchlist-icon" alt="subtract icon for removing movie from watchlist">
                                Remove
                            </button>
        
                        </div>
                        <p>${data.Plot}</p>
                    </div>
                </div>
            `
        }

        renderMovieList()
    }
}

createMovieCardsHtml()

document.addEventListener('click', function(e){
    const button = e.target.closest("[data-movie]")

    if (!button) return

    console.log(button.dataset.movie)

    const movieId = button.dataset.movie

    movieData = movieData.filter(obj => {
        console.log("movie Id: ", obj.imdbID)
        return obj.imdbID !== movieId
    })

    console.log("movie data after removal: ", movieData)

    if(movieData.length === 0){
        localStorage.clear()
        movieCards.innerHTML = origHtml
        return
    }

    localStorage.setItem("userData", JSON.stringify(movieData))

    createMovieCardsHtml()
})


// localStorage.clear()


// console.log()

// movieCards.innerHTML = `<p>Here are the movies that you saved in your watchlist</p>`