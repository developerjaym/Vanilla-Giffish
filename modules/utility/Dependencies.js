import DateService from "../date/DateService.js";
import MovieService from "../movies/MovieService.js";
import LocalStorageService from "../storage/LocalStorageService.js";
import { ToastService } from "../toast/Toast.js";
import ShareServiceFactory from "./ShareService.js";

class Dependencies {
    #dateService;
    #storageService;
    #movieService
    #shareService
    #toastService
    constructor() {
        this.#dateService = new DateService();
        this.#storageService = new LocalStorageService();
        this.#movieService = new MovieService();
        this.#shareService = new ShareServiceFactory("https://localstorage.tools/game/giffish").getShareService()
        this.#toastService = new ToastService();
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
    get shareService() {
        return this.#shareService
    }
    get toastService() {
        return this.#toastService
    }
}

const injector = new Dependencies();

export default injector