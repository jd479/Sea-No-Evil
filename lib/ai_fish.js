const MovingFish = require('./moving_fish');

class AIFish extends MovingFish {
  constructor( options = {} ) {
    const defaultImage = new Image();
    defaultImage.src = "images/default_fish.png";

    options.pos = options.pos || options.game.randomPosition();
    options.image = options.image || window.deafult;
    options.size = options.size || 60;
    options.vel[0] = 200 / options.size;
    super(options);
  }
}
