import { GameService } from "../game/Game.js";
import injector from "../utility/Dependencies.js";
import GameController from "./GameController.js";
import GameView from "./GameView.js";

export default class GameComponent {
  #element;
  #dateService;
  #storageService;
  #movieService;
  constructor(element, dateService = injector.dateService, storageService = injector.storageService, movieService = injector.movieService) {
    this.#element = element;
    this.#element.querySelector("#loading").show();
    this.#dateService = dateService;
    this.#storageService = storageService;
    this.#movieService = movieService;
  }
  async start() {
    const movies = await this.#movieService.getGameMovies();
    const userData = await this.#storageService.read();

    const model = new GameService(this.#dateService, movies, userData);
    const controller = new GameController(model);
    const view = new GameView(this.#element, controller);
    model.subscribe((e) => view.onChange(e));
    model.subscribe((e) => this.#storageService.save(e.data));
    this.#element.querySelector("#loading").close();
    model.start();
  }
}
