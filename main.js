import GameComponent from "./modules/view/GameComponent.js";
(async () => {

  new GameComponent(
    document.getElementById("game")
  ).start();
})();
