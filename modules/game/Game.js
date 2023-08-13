import { LocalDate } from "../date/LocalDate.js";
import { Observable } from "../utility/Observable.js";
import compare from "./guessCompare.js";


const rules = Object.freeze({
    "maxGuesses": 6,

})

export class GameEventType {
    static get START() {
        return "START"
    }
    static get GUESS() {
        return "GUESS"
    }
    static get END() {
        return "END"
    }
}


export class GameService extends Observable {
  #dateService;
  #state;
  #movies;

  constructor(dateService, movies, userData) {
    super()
    this.#dateService = dateService;
    this.#movies = movies;
    const daysPassed = this.#dateService.daysSince(
      LocalDate.fromISOString("2023-08-08T12:00:00.000Z")
    );
    const todayString = LocalDate.today().toISOString()
    this.#state = {
      date: todayString,
      movie: this.#movies[daysPassed % this.#movies.length],
      guesses: [],
      ...userData[todayString]
    };
  }
  start() {
    this.notifyAll({type: GameEventType.START, data: this.#state})
    if(this.#state.guesses.some(guess => guess.result) || this.#state.guesses.length === rules.maxGuesses) {
        this.#state.isDone = true
        this.notifyAll({type: GameEventType.END, data: this.#state})
    }
  }

  get movie() {
    return this.#state.movie;
  }

  judge(guess) {
    const result = compare(guess, this.movie.title)
    const guessObject = {guess, result}
    this.#state.guesses.push(guessObject)
    this.notifyAll({type: GameEventType.GUESS, data: this.#state})
    if(this.#state.guesses.length === rules.maxGuesses || result) {
        this.#state.isDone = true
        this.notifyAll({type: GameEventType.END, data: this.#state})
    }
  }
}