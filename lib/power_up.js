const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const powerUpTypes = ['invincibility', 'doubleSize'];
const powerUpSource = {
  'invincibility': 'images/cape.png',
  'doubleSize': 'images/shroom.png'
};

class PowerUp {
  constructor(options) {
    this.type = options.type || powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    this.image = new Image();
    this.image.src = powerUpSource[this.type];
    this.pos = options.pos;
  }
}

module.exports = PowerUp;
