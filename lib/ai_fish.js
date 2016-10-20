const MovingFish = require('./moving_fish');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class AIFish extends MovingFish {
  constructor( options = {} ) {
    const dir = Math.round(Math.random()) * 2 - 1;
    options.width = options.width || 175 * Math.random() + 25;
    options.vel = [150 / options.width * dir, 0];

    const image = options.image || new Image();

    image.src = "images/default_fish.png";

    if (options.width < 50) {
      image.src = "images/goldfish.png";
    }

    if (options.width > 120) {
      image.src = "images/whale.png";
    }

    image.onload = () => {
      ctx.drawImage(image, 900 * Math.random()
      , 600 * Math.random());
    };

    if (dir !== 1) {
      image.src = image.src.slice(0, -4); //remove tag
      image.src += `_flipped.png`;
    }

    options.pos = options.game.randomPosition();
    options.image = image;
    super(options);
  }

}

module.exports = AIFish;
