const MovingFish = require('./moving_fish');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class AIFish extends MovingFish {
  constructor( options = {} ) {
    const dir = Math.round(Math.random()) * 2 - 1;
    options.width = options.width || 275 * Math.random() + 25;
    options.vel = [150 / options.width * dir, 0];

    const image = options.image || new Image();

    image.src = "images/default_fish.png";

    if (options.width < 50) {
      image.src = "images/goldfish.png";
    }

    if (options.width > 200) {
      image.src = "images/sperm_whale.png";
      options.height = options.width / 2;
      options.width = options.width * 1.4;
    }

    image.onload = () => {
      ctx.drawImage(image, 900 * Math.random()
      , 600 * Math.random());
    };

    if (dir !== 1) {
      image.src = image.src.slice(0, -4); //remove tag
      image.src += `_flipped.png`;
    }

    options.pos = options.pos || options.game.semiRandomPosition();
    options.image = image;
    super(options);
  }

}

module.exports = AIFish;
