import injector from "../utility/Dependencies.js"
import normalize from "../game/normalize.js";
import { GameEventType } from "../game/Game.js";


export default class GuessForm {
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
      this.#input?.addEventListener("input", (e) => {
          const inputValue = e.target.value
          // Showing just the datalist options that match what the user has typed
          //  limited to X number of options, for performance reasons
          //  IF ios Safari ever supports datalist as nicely as Android Chrome
          //  THEN just display ALL options ALL the time
          this.#element.querySelector("#moviesList").replaceChildren(...this.#allOptions.filter(option => option.dataset.normalized.includes(normalize(inputValue,))).filter((o, index) => index < GuessForm.DATALIST_LIMIT))
          
      })
    }
  }