const MovingFish = require('./moving_fish');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class PlayerFish extends MovingFish {
  constructor( options = {} ) {
    const shark = new Image();

    shark.src = "images/shark.png";
    shark.onload = () => {
      ctx.drawImage(shark, 450, 300);
    };

    options.image = shark;

    options.pos = [500,
       300];
    options.width = 75;
    options.vel = [0, 0];
    super(options);
  }

  collideWith(otherFish) {
    // this.game.remove(otherFish);
    // this.pos = this.game.randomPosition();
  }

  swim(stroke) {
    this.vel[0] += stroke[0];
    this.vel[1] += stroke[1];
  }
}

module.exports = PlayerFish;
