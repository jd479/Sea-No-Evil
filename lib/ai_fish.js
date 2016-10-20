const MovingFish = require('./moving_fish');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class AIFish extends MovingFish {
  constructor( options = {} ) {
    const defaultImage = new Image();
    const dir = Math.round(Math.random()) * 2 - 1;

    defaultImage.src = "images/default_fish.png";
    defaultImage.onload = () => {
      // ctx.scale(-1, 1);
      ctx.drawImage(defaultImage, 900 * Math.random()
      , 600 * Math.random());
    };

    options.pos = options.game.randomPosition();
    options.image = options.image || defaultImage;
    options.width = options.width || 150 * Math.random() + 25;

    options.vel = [150 / options.width * dir, 0];
    super(options);
  }

}

module.exports = AIFish;
