const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class MovingFish {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.size = options.size;
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
        this.size, this.size / 2);
  }
}

module.exports = MovingFish;
