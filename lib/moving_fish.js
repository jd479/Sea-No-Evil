const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class MovingFish {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.size = options.size;
    this.image = options.image;
  }

  move(time) {

    window.setTimeout(() => {
      this.pos[0] += this.vel[0];
      this.pos[1] += this.vel[1];
    }, time);

  }

  draw(context) {

    context.drawImage(this.image, 500, 500);
  }
}

module.exports = MovingFish;
