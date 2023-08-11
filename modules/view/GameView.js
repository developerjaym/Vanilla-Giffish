import { GameEventType } from "../game/Game.js";
import ResultsDialog from "./ResultsDialog.js";
import injector from "./../utility/Dependencies.js"
import normalize from "../game/normalize.js";

export default class GameView {
  #element;
  #controller;
  #resultsDialog;
  #mostRecentEvent;
  #form;
  constructor(element, controller) {
    this.#element = element;
    this.#mostRecentEvent = null;
    
    this.#controller = controller;
    this.#resultsDialog = new ResultsDialog(
      this.#element.querySelector("#results")
    );
    this.#form = new GuessForm(
      this.#element.querySelector("#guessForm"),
      this.#controller
    );
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
    this.#element
      .querySelector("#refreshButton")
      .addEventListener("click", () => location.reload());
  }
  onChange(event) {
    this.#mostRecentEvent = event;
    this.#displayGuesses(event.data.guesses);
    this.#form.onChange(event);
    switch (event.type) {
      case GameEventType.START:
        this.#element
          .querySelector("#gifs")
          .append(
            ...event.data.movie.gifs.map((gif) => this.#createImage(gif))
          );
        break;
      case GameEventType.END:
        this.#resultsDialog.show(event.data);
        this.#element
          .querySelector("#refreshButton")
          .classList.remove("hidden");
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
    container.classList.add(`guess--${result ? "right" : "wrong"}`);
    resultDiv.append(`${result ? "✓" : "✗"}`);
    return container;
  }
  
  #createImage({ src, alt }) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.classList.add("gif");
    return img;
  }
}

class GuessForm {
  #movieService;
  #element;
  #allOptions
  #input
  static DATALIST_LIMIT = 128
  constructor(element, controller, movieService = injector.movieService) {
    this.#movieService = movieService;
    this.#element = element;
    this.#input = this.#element.querySelector("#guessInput")
    this.#allOptions = []
    this.#createDatalist()

    this.#element.addEventListener("submit", (e) => {
      e.preventDefault();
      const guess = Object.fromEntries(new FormData(e.target)).guess;
      controller.onGuessEntered(guess);
      e.target.reset();
    });
  }
  onChange(event) {
    switch (event.type) {
      case GameEventType.END:
        this.#element.classList.add("hidden");
        Array.from(this.#element.elements).forEach(
          (formElement) => (formElement.disabled = true)
        );
        break;
    }
  }

  #createDatalistOption(title) {
    const option = document.createElement("option");
    option.dataset.normalized = normalize(title, true)
    option.value = title;
    return option;
  }

  async #createDatalist() {
    const allMovies = await this.#movieService.getAllMovies()
    this.#allOptions = allMovies.map((title) => this.#createDatalistOption(title))
    this.#input.addEventListener("input", (e) => {
        const inputValue = e.target.value
        // Showing just the datalist options that match what the user has typed
        //  limited to X number of options, for performance reasons
        //  IF ios Safari ever supports datalist as nicely as Android Chrome
        //  THEN just display ALL options ALL the time
        this.#element.querySelector("#moviesList").replaceChildren(...this.#allOptions.filter(option => option.dataset.normalized.includes(normalize(inputValue, true))).filter((o, index) => index < GuessForm.DATALIST_LIMIT))
        
    })
  }
}
