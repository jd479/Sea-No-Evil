const AIFish = require('./ai_fish');
const Util = require('./util');

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

  isOut(pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
      (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  }

  moveFishes(time) {
    this.fishes.forEach((fish) => {

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
    this.fishes.forEach((fish) => {
      fish.draw(context);
    });
  }

  checkCollisions() {
    const fishes = this.fishes;
    for (let i = 0; i < fishes.length - 1; i++) {
      for (let j = i + 1; j < fishes.length; j++) {
        const fish1 = fishes[i];
        const fish2 = fishes[j];

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
