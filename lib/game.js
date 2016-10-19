const AIFish = require('./ai_fish');

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

  moveObjects(time) {
    this.fishes.forEach((fish) => {
      fish.move(time);
    });
  }

  draw(context) {
    this.fishes.forEach((fish) => {
      fish.draw(context);
    });
  }

}

Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.NUM_FISH = 8;

module.exports = Game;
