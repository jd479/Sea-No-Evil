const AIFish = require('./ai_fish');
const Util = require('./util');
const PlayerFish = require('./player_fish');

class Game {
  constructor() {
    this.fishes = [];
    this.player = [];
    this.score = 0;
    this.populateFish();
    this.lives = 3;
    // this.highScore = 0;
    // window.localStorage.setItem("score", this.highScore);
    // let hs = document.getElementById("high-score");
    // hs.innerHTML = `high score: ${window.localStorage.getItem("score")}`;
  }

  isOver() {
    if (this.lives < 1) {
      if (confirm(`You earned: ${this.score} points, want to play again?`)) {
        document.location.reload(true);
      } else {
        this.remove(this.player[0]);
      }
    }
    //   this.addPlayer();

  }

  populateFish() {
    this.fishes.push(new AIFish({ game: this,
       width: 40}));

    while (this.fishes.length < Game.NUM_FISH) {
      this.fishes.push(new AIFish({game: this}));
    }
  }

  respawnFish() {
    const player = this.player[0];
    let playerIsSmallest = true;

    this.fishes.forEach((fish) => {
      if (player.isBiggerThan(fish)) {
        playerIsSmallest = false;
      }
    });
    // ensure there is always at least one fish smaller
    // than the player
    if (playerIsSmallest) {
      this.fishes.push(new AIFish({game: this,
      width: player.width * .7 }));
    } else {
      this.fishes.push(new AIFish({ game: this }));
    }
  }

  randomPosition() {
    let x = Game.DIM_X * Math.random();
    let y = Game.DIM_Y * Math.random();
    while (y < 400 && y > 200 ){
      y = Game.DIM_Y * Math.random();
    }
    while (x < 800 && x > 200) {
      x = Game.DIM_X * Math.random();
    }

    return [x, y];
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
    bg.src = "images/ocean.jpg";
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
    let score = document.getElementById("score");
    score.innerHTML = `lives: ${this.lives} score: ${this.score}`;
    const player = this.player[0];
    this.moveFishes(time);
    this.checkCollisions();
    if (key.getPressedKeyCodes().length === 0 && player) {
      player.decelerate();
    }
  }

  wrap(pos) {
    return [
      Util.wrap(pos[0], Game.DIM_X), Util.wrap(pos[1], Game.DIM_Y)
    ];
  }

  remove(fish) {
    if (fish instanceof AIFish) {
      this.fishes.splice(this.fishes.indexOf(fish), 1);
    } else if (fish instanceof PlayerFish) {
      this.player.shift();
    }
  }

}

Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.NUM_FISH = 9;

module.exports = Game;
