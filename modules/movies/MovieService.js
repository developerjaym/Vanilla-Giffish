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
    async getAllMovies() {
        const response = await fetch(this.#allMoviesUrl)
        return await response.json()
    }
}