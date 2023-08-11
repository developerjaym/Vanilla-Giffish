export default class MovieService {
    #gameMoviesUrl
    #allMoviesUrl
    #allMovies;
    #gameMovies;
    constructor() {
        this.#gameMoviesUrl = "./data/movies.json"
        this.#allMoviesUrl = "https://localstorage.tools/data/all-movies.json"
        this.#allMovies = []
        this.#gameMovies = []
    }
    async getGameMovies() {
        if(this.#gameMovies.length) {
            // return "cached" data
            return this.#gameMovies;
        }
        const response = await fetch(this.#gameMoviesUrl)
        this.#gameMovies = await response.json()
        return this.#gameMovies
    }
    async getAllMovies() {
        if(this.#allMovies.length) {
            // return "cached" data
            return this.#allMovies
        }
        const gameMovies = (await this.getGameMovies()).map(movie => movie.title)
        const response = await fetch(this.#allMoviesUrl)
        const arr = await response.json()
        const movies = Array.from(new Set(arr.concat(gameMovies)))
        movies.sort()
        this.#allMovies = movies
        return this.#allMovies
    }
}