import { ToastMoods } from "../toast/Toast.js";
import injector from "../utility/Dependencies.js";

export default class ResultsDialog {
  #element;
  #results;
  constructor(element, shareService = injector.shareService, toastService = injector.toastService) {
    this.#results = {};

    this.#element = element;
    this.#element
      .querySelector(".button--close")
      .addEventListener("click", () => this.#element.close());
    this.#element
      .querySelector("#resultsCopyButton").textContent = shareService.description
    this.#element
      .querySelector("#resultsCopyButton")
      .addEventListener("click", () => shareService.share("Giffish Results", this.#convertResultsToString(this.#results, false), (message) => toastService.push(message, ToastMoods.HAPPY), (error) => toastService.push(error, ToastMoods.SAD)));
  }
  show(gameData) {
    this.#results = gameData;
    this.#element.querySelector("#copyableResults").textContent =
      this.#convertResultsToString(this.#results);
    if (gameData.isDone) {
      this.#element.querySelector("#resultsAnswer").textContent =
        gameData.movie.title;
      this.#element.querySelector("#resultsExplanation").textContent =
        gameData.movie.explanation;
    }
    this.#element.showModal();
  }
  #convertResultsToString(gameData, withURL = true) {
    const guesses = gameData.guesses;
    return `#Giffish #Giffish_${gameData.date.replaceAll("-", "_")}\n${
      guesses.some((guessObj) => guessObj.result) ? "WINNER" : "LOSER"
    }\n${guesses
      .map(({ result }) => (result ? " 🟩" : " ⬛"))
      .join("")}${withURL ? '\nhttps://localstorage.tools/game/giffish/' : ''}`;
  }
}
