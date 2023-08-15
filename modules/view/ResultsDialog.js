import clipboardCopier from "../utility/clipboard.js";

export default class ResultsDialog {
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
          this.#element.querySelector("#resultsExplanation").textContent = gameData.movie.explanation
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