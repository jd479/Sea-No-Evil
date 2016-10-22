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

    this.state = { isInvicible: false, color: 1 };
  }

  collideWith(otherFish) {


      if (this.isBiggerThan(otherFish)) {

        this.width += otherFish.width * .15;
        this.height = this.width / 2;
        this.game.remove(otherFish);
        this.game.respawnFish();
        this.game.score += Math.floor(otherFish.width * .15);
        if (this.width > 1000) {
          alert('500 bonus points! Bonus life and rebirth!');
          this.game.score += 500;
          this.width = 50;
          this.height = 25;
          this.pos = this.game.randomPosition();
          this.brake();
          this.game.lives++;
        }

      } else {
        if (this.state.isInvicible) {
          return;
        } else {
        const munch = new Audio('./sound/chomp.wav');
        munch.play();
        this.width = (50 + this.width) / 2;
        this.height = this.width / 2;
        this.pos = this.game.trulyRandomPosition();
        this.brake();
        this.state.isInvicible = true;
        window.setTimeout(() => {
          this.state.isInvicible = false;
        }, 4000);
        this.game.lives--;
        this.game.isOver();
        if (this.game.lives) {
          const invincible = new Audio('./sound/invincible.mp3');
          invincible.play();
        }
      }
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

  draw(context) {
    this.image = new Image();
    if (this.state.isInvicible) {
      if (this.vel[0] < 0) {
        this.image.src = "images/super_shark_flipped.png";
      } else {
        this.image.src = "images/super_shark.png";
      }

    } else {
      if (this.vel[0] < 0) {
        this.image.src = "images/shark_flipped.png";
      } else {
        this.image.src = "images/shark.png";
      }
    }
    context.drawImage(this.image,
       this.pos[0], this.pos[1],
        this.width, this.height);
  }

    sprite (options) {
    var that = {};

    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;

    return that;
  }

  decelerate() {
    this.vel[0] = this.vel[0] * .96;
    this.vel[1] = this.vel[1] * .96;
  }
}

module.exports = PlayerFish;
