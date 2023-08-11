import DateService from "./modules/date/DateService.js";
import { GameService, GameEventType } from "./modules/game/Game.js";
import MovieService from "./modules/movies/MovieService.js";
import LocalStorageService from "./modules/storage/LocalStorageService.js";
import clipboardCopier from "./modules/utility/clipboard.js";

class GameController {
  #model;
  constructor(model) {
    this.#model = model;
  }
  onGuessEntered(guess) {
    this.#model.judge(guess);
  }
}

class ResultsDialog {
  #copier;
  #element;
  #results;
  constructor(element, copier = clipboardCopier) {
    this.#results = {};
    this.#copier = () =>
      copier(
        this.#convertResultsToString(this.#results),
        () => {},
        () => {}
      );
    this.#element = element;
    this.#element
      .querySelector(".button--close")
      .addEventListener("click", () => this.#element.close());
    this.#element
      .querySelector("#resultsCopyButton")
      .addEventListener("click", () => this.#copier());
  }
  show(gameData) {
    this.#results = gameData;
    this.#element.querySelector("#copyableResults").textContent =
      this.#convertResultsToString(this.#results);
    if(gameData.isDone) {
        this.#element.querySelector("#resultsAnswer").textContent = gameData.movie.title
    }
    this.#element.showModal();
  }
  #convertResultsToString(gameData) {
    const guesses = gameData.guesses;
    return `#Giffish #Giffish_${gameData.date.replaceAll("-", "_")}\n${
      guesses.some((guessObj) => guessObj.result) ? "WINNER" : "LOSER"
    }\n${guesses
      .map(({ result }) => (result ? " 🟩" : " ⬛"))
      .join("")}\nhttps://localstorage.tools/game/giffish/`;
  }
}

class GameView {
  #element;
  #controller;
  #resultsDialog;
  #mostRecentEvent;
  constructor(element, controller, movieTitles) {
    this.#element = element;
    this.#mostRecentEvent = null;
    this.#element
      .querySelector("#moviesList")
      .append(...movieTitles.map((title) => this.#createDatalistOption(title)));
    this.#controller = controller;
    this.#resultsDialog = new ResultsDialog(
      this.#element.querySelector("#results")
    );
    this.#element
      .querySelector("#guessForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const guess = Object.fromEntries(new FormData(e.target)).guess;
        this.#controller.onGuessEntered(guess);
      });
    this.#element
      .querySelector("#headerShareButton")
      .addEventListener("click", () => {
        this.#resultsDialog.show(this.#mostRecentEvent.data);
      });
    this.#element
      .querySelector("#about .button--close")
      .addEventListener("click", () =>
        this.#element.querySelector("#about").close()
      );
    this.#element
      .querySelector("#headerAboutButton")
      .addEventListener("click", () =>
        this.#element.querySelector("#about").showModal()
      );
      this.#element.querySelector("#refreshButton").addEventListener("click", () => location.reload())
  }
  onChange(event) {
    this.#mostRecentEvent = event;
    // TODO dry this up
    switch (event.type) {
      case GameEventType.START:
        this.#displayGuesses(event.data.guesses);
        this.#element
          .querySelector("#gifs")
          .append(
            ...event.data.movie.gifs.map((gif) => this.#createImage(gif))
          );
        break;
      case GameEventType.GUESS:
        this.#displayGuesses(event.data.guesses);
        break;
      case GameEventType.END:
        this.#displayGuesses(event.data.guesses);
        this.#resultsDialog.show(event.data);
        this.#element.querySelector("#guessForm").classList.add("hidden")
        this.#element.querySelector("#refreshButton").classList.remove("hidden")
        Array.from(this.#element.querySelector("#guessForm").elements).forEach(
          (formElement) => (formElement.disabled = true)
        );
        break;
    }
  }
  #displayGuesses(guesses) {
    // guesses can be right or wrong
    this.#element
      .querySelector("#previousGuesses")
      .replaceChildren(
        ...guesses.map((guessObj) => this.#buildGuess(guessObj))
      );
  }
  #buildGuess({ guess, result }) {
    const container = document.createElement("div");
    container.classList.add("guess-container");
    const resultDiv = document.createElement("div");
    resultDiv.classList.add("guess__result");
    container.appendChild(resultDiv);
    const guessDiv = document.createElement("div");
    guessDiv.classList.add("guess__text");
    guessDiv.textContent = guess;
    container.appendChild(guessDiv);
    if (result) {
      container.classList.add("guess--right");
      resultDiv.append("✓");
    } else {
      container.classList.add("guess--wrong");
      resultDiv.append("✗");
    }
    return container;
  }
  #createDatalistOption(title) {
    const option = document.createElement("option");
    option.value = title;
    return option;
  }
  #createImage({ src, alt }) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.classList.add("gif");
    return img;
  }
}

class GameComponent {
  #element;
  constructor(element, dateService, storageService, movieService) {
    this.#element = element;
    this.#element.querySelector("#loading").show();
    this.#prep(dateService, storageService, movieService);
  }
  async #prep(dateService, storageService, movieService) {
    const movies = await movieService.read();
    const userData = await storageService.read();
    const allMovies = await movieService.getAllMovies(movies.map(movie => movie.title));

    const model = new GameService(dateService, movies, userData);
    const controller = new GameController(model);
    const view = new GameView(this.#element, controller, allMovies);
    model.subscribe((e) => view.onChange(e));
    model.subscribe((e) => storageService.save(e.data));
    this.#element.querySelector("#loading").close();
    model.start();
  }
}

(async () => {
  const dateService = new DateService();
  const storageService = new LocalStorageService();
  const movieService = new MovieService();

  const component = new GameComponent(
    document.getElementById("game"),
    dateService,
    storageService,
    movieService
  );
})();
