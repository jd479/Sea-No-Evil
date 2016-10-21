const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class MovingFish {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.width = options.width;
    this.height = options.height || options.width / 2;
    this.image = options.image;
    this.game = options.game;
  }

  move(time) {
    const velocityScale = time / NORMAL_FRAME_TIME_DELTA,
        offsetX = this.vel[0] * velocityScale,
        offsetY = this.vel[1] * velocityScale;

    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];

    if (this.game.isOut(this.pos)) {
      this.pos = this.game.wrap(this.pos);
    }

  }

  draw(context) {
    context.drawImage(this.image,
       this.pos[0], this.pos[1],
        this.width, this.height);
  }

  isCollidedWith(otherFish) {
    if (this.pos[0] < otherFish.pos[0] + otherFish.width &&
      this.pos[0] + this.width > otherFish.pos[0] &&
      this.pos[1] < otherFish.pos[1] + otherFish.height &&
      this.height + this.pos[1] > otherFish.pos[1]) {
      return true;
    } else {
      return false;
    }
  }

  collideWith(otherFish) {
  }

  isBiggerThan(otherFish) {
    return this.width > otherFish.width;
  }

}
const NORMAL_FRAME_TIME_DELTA = 1000/90;

module.exports = MovingFish;
