class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
  }

  start() {

    window.setInterval(this.game.moveObjects(1000), 20);
    window.setInterval(this.game.draw(this.ctx), 20);
  }
}

module.exports = GameView;
