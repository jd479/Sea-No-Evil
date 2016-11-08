const AIFish = require('./ai_fish');
const Util = require('./util');
const PlayerFish = require('./player_fish');
const VanillaModal = require('vanilla-modal');

class Game {
  constructor() {
    this.fishes = [];
    this.player = [];
    this.score = 0;
    this.populateFish();
    this.lives = 3;
    if (!localStorage.getItem('highScore')) {
      localStorage.setItem('highScore', 0);
    }
  }

  isOver() {
    if (this.lives < 1) {
      document.getElementById('gameOver').click();
      let gameOver = document.getElementById('gameOver-text');
      gameOver.innerHTML = `You earned: ${this.score} points, click x to play again!`;
      this.restart();
    }
  }

  restart() {
    const player = this.player[0];
    this.lives = 3;
    this.score = 0;
    player.pos = [Game.DIM_X /2, Game.DIM_Y / 2];
    player.brake();
    player.width = 50;
    player.height = 25;
    this.fishes = [];
    this.populateFish();
  }

  populateFish() {
    this.fishes.push(new AIFish({ game: this,
       width: 40, pos: [100, 400]}));
    this.fishes.push(new AIFish({ game: this,
       width: 45, pos: [800, 250]}));
    this.fishes.push(new AIFish({ game: this,
       width: 48}));
    this.fishes.push(new AIFish({ game: this,
       width: 150}));
    this.fishes.push(new AIFish({ game: this,
       width: 205}));

    while (this.fishes.length < Game.NUM_FISH) {
      this.fishes.push(new AIFish({game: this, width: 200 * Math.random()}));
    }
  }

  respawnFish() {
    let largeFish = 0;
    const player = this.player[0];
    for (let i = 0; i < this.fishes.length; i++) {
      if (this.fishes[i].width > 200) {
        largeFish++;
      }
    }

    if (this.playerIsSmallest()) {
      let i = 0;
      while (i < 3) {
        this.fishes.push(new AIFish({game: this,
          width: player.width * .7,
          pos: this.trulyRandomPosition() }));
          i++;
      }
    } else {
      let length = 225 * Math.random() + 30;
      while (largeFish >= 2 && length > player.width) {
        length = 225 * Math.random() + 30;
      }
      this.fishes.push(new AIFish({ game: this,
        pos: [900, Game.DIM_Y * Math.random()],
      width: length}));
    }
  }

  playerIsSmallest() {
    // ensure there is always at least one fish smaller
    // than the player
    const player = this.player[0];
    let playerIsSmallest = true;
    this.fishes.forEach((fish) => {
      if (player.isBiggerThan(fish)) {
        playerIsSmallest = false;
      }
    });
    return playerIsSmallest;
  }

  semiRandomPosition() {
    let x = Game.DIM_X * Math.random();
    let y = Game.DIM_Y * Math.random();
    while (y < 400 && y > 200 || y > 950){
      y = Game.DIM_Y * Math.random();
    }
    while (x < 800 && x > 200) {
      x = Game.DIM_X * Math.random();
    }
    return [x, y];
  }

  trulyRandomPosition() {
    let x = Game.DIM_X * Math.random();
    let y = Game.DIM_Y * Math.random();
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
    if (this.score > localStorage.getItem('highScore')) {
      localStorage.setItem('highScore', this.score);
    }
    score.innerHTML = `lives: ${this.lives} score: ${this.score} high score: ${localStorage.getItem('highScore')}`;
    const player = this.player[0];
    if (player && this.playerIsSmallest()) {
      this.fishes.push(new AIFish({ game: this, width: player.width * 0.8 }));
    }
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
Game.NUM_FISH = 10;

module.exports = Game;
