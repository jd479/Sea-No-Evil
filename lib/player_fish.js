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
    options.width = 50;
    options.vel = [0, 0];
    super(options);
  }

  collideWith(otherFish) {
    if (this.width > otherFish.width) {
      this.width += otherFish.width * .1;
      this.height = this.width / 2;
      this.game.remove(otherFish);
      this.game.respawnFish();

    } else {
      this.game.remove(this);
    }
  }

  swim(stroke) {

    if ( Math.abs(this.vel[0]) < 5 || ((this.vel[0] ^ stroke[0]) < 0)) {
      this.vel[0] += stroke[0];
    }
    if ( Math.abs(this.vel[1]) < 5 || ((this.vel[1] ^ stroke[1]) < 0)) {
      this.vel[1] += stroke[1];
    }
  }

  brake() {
    this.vel = [0, 0];
  }

  decelerate() {
    this.vel[0] = this.vel[0] * .97;
    this.vel[1] = this.vel[1] * .97;
  }
}

module.exports = PlayerFish;
