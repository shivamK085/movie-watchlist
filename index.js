let movieCardsHtml = ""
const searchInput = document.getElementById('search-input')
const movieCards = document.getElementById("movies-container")
const elements = document.querySelectorAll(".input-focus")

elements.forEach(element => {
    element.addEventListener("click", () => {
        console.log("clicked me!")
        searchInput.focus();
    })
})

function renderMovieList() {
    // console.log(movieCardsHtml)

    movieCards.innerHTML = movieCardsHtml
    // console.log(movieCards.innerHTML)
}

async function fetchMovieCardData(title, year) {
    let queryStrTitle = ""
    for (let i = 0; i < title.length; i++) {
        if (title[i] === ' ') {
            queryStrTitle += '+'
        }
        else {
            queryStrTitle += title[i]
        }
    }


    const res = await fetch(`https://www.omdbapi.com/?apikey=f9535359&t=${queryStrTitle}&y=${year}`)
    const data = await res.json()

    // console.log(data)

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
                        <img src="watchlist-icon.svg" class="watchlist-icon" alt="plus icon for adding movie to watchlist">
                        Watchlist
                    </button>

                </div>
                <p>${data.Plot}</p>
            </div>
        </div>
    `

    // console.log(movieCardsHtml)


}

function displayError(){
    movieCardsHtml += `<p id="error-msg">
        Unable to find what you are looking for. Please try another search.
    </p>`
}


async function fetchMovieNameList(moveiName) {
    let queryStrTitle = ""
    for (let i = 0; i < moveiName.length; i++) {
        if (moveiName[i] === ' ') {
            queryStrTitle += '+'
        }
        else {
            queryStrTitle += moveiName[i]
        }
    }

    if (!queryStrTitle) return

    const res = await fetch(`https://www.omdbapi.com/?apikey=f9535359&s=${queryStrTitle}`)
    const data = await res.json()

    // console.log(data)
    if(data.Response === 'False'){
        displayError()
        renderMovieList()
        return
    }

    for (let movie of data.Search) {
        // console.log(movie)

        await fetchMovieCardData(movie.Title, movie.Year)
    }

    renderMovieList()
}

document.getElementById('form').addEventListener('submit', function (e) {
    // console.log("came here")
    e.preventDefault()
    movieCardsHtml = ""
    const movieName = searchInput.value
    searchInput.value = "" // replace with searchInput.value
    fetchMovieNameList(movieName)
    searchInput.blur()
})

// const userData = {
//     image: "hello",
//     content: "this is the content"
// }

// localStorage.setItem('userData', JSON.stringify(userData))

// console.log(localStorage.getItem('userData'))

const hasData = JSON.parse(localStorage.getItem('userData'))
let watchlistData = hasData ? hasData : []

document.addEventListener('click', async function(e){
    // console.log("click event trigerred!")
    // console.log("data attribute: ", e.target.dataset.movie)
    // if(e.target.dataset.movie){
    //     // console.log("it is a movie")
    //     console.log("Added this movie to watchlist", e.target.dataset.movie)

    const button = e.target.closest("[data-movie]")

    if (!button) return

    button.innerHTML = `
                <button class="watchlist-btn">
                    Added
                </button>
    `
                
    const movieId = button.dataset.movie

    if(watchlistData.some(obj => obj.imdbID === movieId)){
        console.log("movie already added to watchlist")
        return
    }


    const res = await fetch(`https://www.omdbapi.com/?apikey=f9535359&i=${movieId}`)
    const data = await res.json()

    
    watchlistData.push(data)

    localStorage.setItem('userData', JSON.stringify(watchlistData))
    
})

const savedData = JSON.parse(localStorage.getItem('userData'))
// localStorage.clear()

// console.log(typeof(savedData))
