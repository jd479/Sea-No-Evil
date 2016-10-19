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
	
	class Game {
	  constructor() {
	    this.fishes = [];
	    this.player = [];
	
	    this.populateFish();
	  }
	
	  populateFish() {
	    for (let i = 0; i < Game.NUM_FISH; i++) {
	      this.fishes.push(new AIFish({game: this}));
	    }
	  }
	
	  randomPosition() {
	    return [
	      Game.DIM_X * Math.random(),
	      Game.DIM_Y * Math.random()
	    ];
	  }
	
	  moveObjects(time) {
	    this.fishes.forEach((fish) => {
	      fish.move(time);
	    });
	  }
	
	  draw(context) {
	    this.fishes.forEach((fish) => {
	      fish.draw(context);
	    });
	  }
	
	}
	
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	Game.NUM_FISH = 8;
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const MovingFish = __webpack_require__(3);
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	
	class AIFish extends MovingFish {
	  constructor( options = {} ) {
	    const defaultImage = new Image();
	    defaultImage.src = "images/default_fish.png";
	    defaultImage.onload = () => {
	      ctx.drawImage(defaultImage, 900 * Math.random()
	      , 600 * Math.random() , 100, 50);
	    };
	
	    const dir = Math.round(Math.random()) * 2 - 1;
	
	    options.pos = options.pos || options.game.randomPosition();
	    options.image = options.image || defaultImage;
	    options.size = options.size || 60;
	
	    options.vel = [200 / options.size * dir, 0];
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	class GameView {
	  constructor(game, ctx) {
	    this.ctx = ctx;
	    this.game = game;
	  }
	
	  start() {
	
	    window.setInterval(this.game.moveObjects(1000), 20);
	    window.setInterval(this.game.draw(this.ctx), 20);
	  }
	}
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map