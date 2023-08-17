import { GameEventType } from "../game/Game.js";
import injector from "../utility/Dependencies.js";
import GuessForm from "./GuessForm.js";
import ResultsDialog from "./ResultsDialog.js";

export default class GameView {
  #element;
  #controller;
  #resultsDialog;
  #mostRecentEvent;
  #form;
  constructor(element, controller, dateService = injector.dateService) {
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
    dateService.subscribe(({countdown, isNewDay}) => {
      if (
        isNewDay &&
        !this.#element
          .querySelector("#countdownTimer")
          .classList.contains("hidden")
      ) {
        location.reload()
      }
      else {
        this.#element
          .querySelector("#countdownTimerText").textContent = countdown
      }
    });
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
          .querySelector("#countdownTimer")
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
