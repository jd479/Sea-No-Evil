class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.player = this.game.addPlayer();
  }

  start() {
    document.getElementById('modal').click();
    this.bindKeyHandler();
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    const delta = time - this.lastTime;
    this.game.step(delta);
    this.game.draw(this.ctx);
    this.lastTime = time;
    requestAnimationFrame(this.animate.bind(this));
  }

  bindKeyHandler() {
    const player = this.player;
    Object.keys(GameView.MOVES).forEach((k) => {
      let move = GameView.MOVES[k];
      key(k, (e) => {
        e.preventDefault();
        player.swim(move); });
    });
    key('q', () => { player.brake(); });
    key('e', () => { player.brake(); });
    key('m', () => { this.game.toggleSound(); });
  }
}

GameView.MOVES = {
  "w": [ 0, -2.5],
  "a": [-3.5,  0],
  "s": [ 0,  2.5],
  "d": [ 3.5,  0],
  "up": [ 0, -2.5],
  "left": [-3.5,  0],
  "down": [ 0,  2.5],
  "right": [ 3.5,  0]
};

module.exports = GameView;
