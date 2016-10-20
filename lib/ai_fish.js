const MovingFish = require('./moving_fish');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class AIFish extends MovingFish {
  constructor( options = {} ) {
    const defaultImage = new Image();
    const dir = Math.round(Math.random()) * 2 - 1;

    defaultImage.src = "images/default_fish.png";
    defaultImage.onload = () => {
      ctx.drawImage(defaultImage, 900 * Math.random()
      , 600 * Math.random() , 100, 50);

    };

    options.pos = options.pos || options.game.randomPosition();
    options.image = options.image || defaultImage;
    options.width = options.width || 100;

    options.vel = [200 / options.width * dir, 0];
    super(options);
  }

}

module.exports = AIFish;
