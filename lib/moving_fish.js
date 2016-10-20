const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class MovingFish {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.width = options.width;
    this.image = options.image;
    this.game = options.game;
  }

  move(time) {

    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];

    if (this.game.isOut(this.pos)) {
      this.pos = this.game.wrap(this.pos);
    }

  }

  draw(context) {
    context.drawImage(this.image,
       this.pos[0], this.pos[1],
        this.width, this.width / 2);
  }

  isCollidedWith(otherFish) {
    if (this.pos[0] < otherFish.pos[0] + otherFish.width &&
      this.pos[0] + this.width > otherFish.pos[0] &&
      this.pos[1] < otherFish.pos[1] + otherFish.width / 2 &&
      this.width / 2 + this.pos[1] > otherFish.pos[1]) {
      return true;
    } else {
      return false;
    }
  }

  collideWith(otherFish) {
    this.game.remove(this);
    this.game.remove(otherFish);
  }

}

module.exports = MovingFish;
