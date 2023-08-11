import DateService from "../date/DateService.js";
import MovieService from "../movies/MovieService.js";
import LocalStorageService from "../storage/LocalStorageService.js";

class Dependencies {
    #dateService;
    #storageService;
    #movieService
    constructor() {
        this.#dateService = new DateService();
        this.#storageService = new LocalStorageService();
        this.#movieService = new MovieService();
    }
    get dateService() {
        return this.#dateService
    }
    get storageService() {
        return this.#storageService
    }
    get movieService() {
        return this.#movieService
    }
}

const injector = new Dependencies();

export default injector