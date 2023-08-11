export default class MovieService {
    #gameMoviesUrl
    #allMoviesUrl
    constructor() {
        this.#gameMoviesUrl = "./data/movies.json"
        this.#allMoviesUrl = "https://localstorage.tools/data/all-movies.json"
    }
    async read() {
        const response = await fetch(this.#gameMoviesUrl)
        return await response.json()
    }
    async getAllMovies(additionalMovies = []) {
        const response = await fetch(this.#allMoviesUrl)
        const arr = await response.json()
        const movies = Array.from(new Set(arr.concat(additionalMovies)))
        movies.sort()
        return movies
    }
}