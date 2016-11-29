const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const powerUpTypes = ['invincibility', 'doubleSize'];

class PowerUp {
  constructor(options) {
    this.type = options.type;
  }
}
