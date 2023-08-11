export default class GameController {
    #model;
    constructor(model) {
      this.#model = model;
    }
    onGuessEntered(guess) {
      this.#model.judge(guess);
    }
  }