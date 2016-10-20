/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(4);
	
	document.addEventListener("DOMContentLoaded", function(){
	  const canvas = document.getElementById("canvas");
	  canvas.width = Game.DIM_X;
	  canvas.height = Game.DIM_Y;
	
	  const ctx = canvas.getContext("2d");
	  const game = new Game();
	  const gameView = new GameView(game, ctx);
	  gameView.start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const AIFish = __webpack_require__(2);
	const Util = __webpack_require__(5);
	const PlayerFish = __webpack_require__(6);
	
	class Game {
	  constructor() {
	    this.fishes = [];
	    this.player = [];
	    this.score = 0;
	    this.populateFish();
	    this.count = 0;
	  }
	
	  isOver() {
	    if (this.player.length === 0 && this.count === 0) {
	      this.count++;
	      alert(`You earned: ${this.score} points`);
	    }
	  }
	
	  populateFish() {
	    this.fishes.push(new AIFish({ game: this,
	       width: 40}));
	
	    while (this.fishes.length < Game.NUM_FISH) {
	      this.fishes.push(new AIFish({game: this}));
	    }
	  }
	
	  respawnFish() {
	    const player = this.player[0];
	    let playerIsSmallest = true;
	
	    this.fishes.forEach((fish) => {
	      if (player.isBiggerThan(fish)) {
	        playerIsSmallest = false;
	      }
	    });
	    // ensure there is always at least one fish smaller
	    // than the player
	    if (playerIsSmallest) {
	      this.fishes.push(new AIFish({game: this,
	      width: player.width * .5 }));
	    } else {
	      this.fishes.push(new AIFish({ game: this }));
	    }
	  }
	
	  randomPosition() {
	    let x = Game.DIM_X * Math.random();
	    let y = Game.DIM_Y * Math.random();
	    while (y < 325 && y > 275) {
	      y = Game.DIM_Y * Math.random();
	    }
	    while (x < 700 && x > 300) {
	      x = Game.DIM_X * Math.random();
	    }
	
	    return [x, y];
	  }
	
	  addPlayer() {
	    const playerFish = new PlayerFish({ game: this });
	    this.player.push(playerFish);
	    return playerFish;
	  }
	
	  allFishes() {
	    return [].concat(this.player, this.fishes);
	  }
	
	  isOut(pos) {
	    return (pos[0] < 0) || (pos[1] < 0) ||
	      (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
	  }
	
	  moveFishes(time) {
	    this.allFishes().forEach((fish) => {
	
	      fish.move(time);
	    });
	  }
	
	  draw(context) {
	    var bg = new Image();
	      bg.onload = function() {
	        var pattern = context.createPattern(bg, 'repeat');
	
	        context.rect(0, 0, Game.DIM_X, Game.DIM_Y);
	        context.fillStyle = pattern;
	        context.fill();
	      };
	    bg.src = "images/ocean.png";
	    context.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	    context.fillStyle = bg;
	    context.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	
	    this.allFishes().forEach((fish) => {
	      fish.draw(context);
	    });
	  }
	
	  checkCollisions() {
	    const allFishes = this.allFishes();
	    for (let i = 0; i < allFishes.length - 1; i++) {
	      for (let j = i + 1; j < allFishes.length; j++) {
	        const fish1 = allFishes[i];
	        const fish2 = allFishes[j];
	
	        if (fish1.isCollidedWith(fish2)) {
	          const collision = fish1.collideWith(fish2);
	          if (collision) return;
	        }
	      }
	    }
	  }
	
	  step(time) {
	    const player = this.player[0];
	    this.moveFishes(time);
	    this.checkCollisions();
	    if (key.getPressedKeyCodes().length === 0 && player) {
	      player.decelerate();
	    }
	    this.isOver();
	  }
	
	  wrap(pos) {
	    return [
	      Util.wrap(pos[0], Game.DIM_X), Util.wrap(pos[1], Game.DIM_Y)
	    ];
	  }
	
	  remove(fish) {
	    if (fish instanceof AIFish) {
	      this.fishes.splice(this.fishes.indexOf(fish), 1);
	    } else if (fish instanceof PlayerFish) {
	      this.player.shift();
	    }
	  }
	
	}
	
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	Game.NUM_FISH = 10;
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const MovingFish = __webpack_require__(3);
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	
	class AIFish extends MovingFish {
	  constructor( options = {} ) {
	    const dir = Math.round(Math.random()) * 2 - 1;
	    options.width = options.width || 150 * Math.random() + 25;
	    options.vel = [150 / options.width * dir, 0];
	
	    const image = options.image || new Image();
	
	    image.src = "images/default_fish.png";
	
	    if (options.width < 50) {
	      image.src = "images/goldfish.png";
	    }
	
	    if (options.width > 100) {
	      image.src = "images/whale.png";
	    }
	
	    image.onload = () => {
	      ctx.drawImage(image, 900 * Math.random()
	      , 600 * Math.random());
	    };
	
	    if (dir != 1) {
	      image.src = image.src.slice(0, -4); //remove tag
	      image.src += `_flipped.png`;
	    }
	
	    options.pos = options.game.randomPosition();
	    options.image = image;
	    super(options);
	  }
	
	}
	
	module.exports = AIFish;


/***/ },
/* 3 */
/***/ function(module, exports) {

	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	
	class MovingFish {
	  constructor(options) {
	    this.pos = options.pos;
	    this.vel = options.vel;
	    this.width = options.width;
	    this.height = options.width / 2;
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	class GameView {
	  constructor(game, ctx) {
	    this.ctx = ctx;
	    this.game = game;
	    this.player = this.game.addPlayer();
	  }
	
	  start() {
	    this.bindKeyHandler();
	    this.lastTime = 0;
	    requestAnimationFrame(this.animate.bind(this));
	  }
	
	  animate(time) {
	    const delta = time - this.lastTime;
	    this.game.step(delta);
	    this.game.draw(this.ctx);
	    this.lastTime = time;
	    requestAnimationFrame(this.animate.bind(this));
	  }
	
	  bindKeyHandler() {
	    const player = this.player;
	    Object.keys(GameView.MOVES).forEach((k) => {
	      let move = GameView.MOVES[k];
	      key(k, () => { player.swim(move); });
	    });
	    key('space', () => { player.brake(); });
	  }
	}
	
	GameView.MOVES = {
	  "w": [ 0, -1],
	  "a": [-1,  0],
	  "s": [ 0,  1],
	  "d": [ 1,  0],
	};
	
	module.exports = GameView;


/***/ },
/* 5 */
/***/ function(module, exports) {

	const Util = {
	  wrap (coord, edge) {
	    if (coord < 0) {
	      return edge - (coord % edge);
	    } else if (coord > edge) {
	      return coord % edge;
	    } else {
	      return coord;
	    }
	  }
	};
	
	module.exports = Util;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const MovingFish = __webpack_require__(3);
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	
	class PlayerFish extends MovingFish {
	  constructor( options = {} ) {
	    const shark = new Image();
	
	    shark.src = "images/shark.png";
	    shark.onload = () => {
	      ctx.drawImage(shark, 450, 300);
	    };
	
	    options.image = shark;
	
	    options.pos = [500,
	       300];
	    options.width = 50;
	    options.vel = [0, 0];
	    super(options);
	  }
	
	  collideWith(otherFish) {
	    if (this.isBiggerThan(otherFish)) {
	      this.width += otherFish.width * .1;
	      this.height = this.width / 2;
	      this.game.remove(otherFish);
	      this.game.respawnFish();
	      this.game.score = Math.floor(this.width) * .5;
	
	    } else {
	      this.game.remove(this);
	    }
	  }
	
	  swim(stroke) {
	    if ( Math.abs(this.vel[0]) < 5 || ((this.vel[0] ^ stroke[0]) < 0)) {
	      this.vel[0] += stroke[0];
	    }
	    if ( Math.abs(this.vel[1]) < 5 || ((this.vel[1] ^ stroke[1]) < 0)) {
	      this.vel[1] += stroke[1];
	    }
	  }
	
	  brake() {
	    this.vel = [0, 0];
	  }
	
	  draw(context) {
	    this.image = new Image();
	    if (this.vel[0] < 0) {
	      this.image.src = "images/shark_flipped.png";
	    } else {
	      this.image.src = "images/shark.png";
	    }
	    context.drawImage(this.image,
	       this.pos[0], this.pos[1],
	        this.width, this.height);
	  }
	
	  decelerate() {
	    this.vel[0] = this.vel[0] * .96;
	    this.vel[1] = this.vel[1] * .96;
	  }
	}
	
	module.exports = PlayerFish;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map