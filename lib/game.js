const AIFish = require('./ai_fish');
const Util = require('./util');
const PlayerFish = require('./player_fish');

class Game {
  constructor() {
    this.fishes = [];
    this.player = [];

    this.populateFish();
  }

  populateFish() {
    for (let i = 0; i < Game.NUM_FISH; i++) {
      this.fishes.push(new AIFish({game: this}));
    }
  }

  randomPosition() {
    return [
      Game.DIM_X * Math.random(),
      Game.DIM_Y * Math.random()
    ];
  }

  addPlayer() {
    const playerFish = new PlayerFish({ game: this });
    this.player.push(playerFish);
    return playerFish;
  }

  allFishes() {
    return [].concat(this.player, this.fishes);
  }

  isOut(pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
      (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  }

  moveFishes(time) {
    this.allFishes().forEach((fish) => {

      fish.move(time);
    });

  }

  draw(context) {
    var bg = new Image();
      bg.onload = function() {
        var pattern = context.createPattern(bg, 'repeat');

        context.rect(0, 0, Game.DIM_X, Game.DIM_Y);
        context.fillStyle = pattern;
        context.fill();
      };
    bg.src = "images/ocean.png";
    context.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    context.fillStyle = bg;
    context.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allFishes().forEach((fish) => {
      fish.draw(context);
    });
  }

  checkCollisions() {
    const allFishes = this.allFishes();
    for (let i = 0; i < allFishes.length - 1; i++) {
      for (let j = i + 1; j < allFishes.length; j++) {
        const fish1 = allFishes[i];
        const fish2 = allFishes[j];

        if (fish1.isCollidedWith(fish2)) {
          const collision = fish1.collideWith(fish2);
          if (collision) return;
        }
      }
    }
  }

  step(time) {
    this.moveFishes(time);
    this.checkCollisions();
  }

  wrap(pos) {
    return [
      Util.wrap(pos[0], Game.DIM_X), Util.wrap(pos[1], Game.DIM_Y)
    ];
  }

  remove(fish) {
    this.fishes.splice(this.fishes.indexOf(fish), 1);
  }

}

Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.NUM_FISH = 8;

module.exports = Game;
