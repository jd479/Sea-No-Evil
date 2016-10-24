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
	const GameView = __webpack_require__(6);
	
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
	const Util = __webpack_require__(4);
	const PlayerFish = __webpack_require__(5);
	
	class Game {
	  constructor() {
	    this.fishes = [];
	    this.player = [];
	    this.score = 0;
	    this.populateFish();
	    this.lives = 3;
	  }
	
	  isOver() {
	    if (this.lives < 1) {
	      if (confirm(`You earned: ${this.score} points, want to play again?`)) {
	        document.location.reload(true);
	      } else {
	        this.remove(this.player[0]);
	      }
	    }
	  }
	
	  populateFish() {
	    this.fishes.push(new AIFish({ game: this,
	       width: 40, pos: [100, 400]}));
	    this.fishes.push(new AIFish({ game: this,
	       width: 45, pos: [800, 250]}));
	    this.fishes.push(new AIFish({ game: this,
	       width: 48}));
	
	    while (this.fishes.length < Game.NUM_FISH) {
	      this.fishes.push(new AIFish({game: this}));
	    }
	  }
	
	  respawnFish() {
	    const player = this.player[0];
	    if (this.playerIsSmallest()) {
	      this.fishes.push(new AIFish({game: this,
	      width: player.width * .7,
	        pos: this.trulyRandomPosition() }));
	    } else {
	      this.fishes.push(new AIFish({ game: this,
	        pos: [900, Game.DIM_Y * Math.random()]}));
	    }
	  }
	
	  playerIsSmallest() {
	    // ensure there is always at least one fish smaller
	    // than the player
	    const player = this.player[0];
	    let playerIsSmallest = true;
	    this.fishes.forEach((fish) => {
	      if (player.isBiggerThan(fish)) {
	        playerIsSmallest = false;
	      }
	    });
	    return playerIsSmallest;
	  }
	
	  semiRandomPosition() {
	    let x = Game.DIM_X * Math.random();
	    let y = Game.DIM_Y * Math.random();
	    while (y < 400 && y > 200 ){
	      y = Game.DIM_Y * Math.random();
	    }
	    while (x < 800 && x > 200) {
	      x = Game.DIM_X * Math.random();
	    }
	    return [x, y];
	  }
	
	  trulyRandomPosition() {
	    let x = Game.DIM_X * Math.random();
	    let y = Game.DIM_Y * Math.random();
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
	    bg.src = "images/ocean.jpg";
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
	    let score = document.getElementById("score");
	    score.innerHTML = `lives: ${this.lives} score: ${this.score}`;
	    const player = this.player[0];
	    if (player && this.playerIsSmallest()) {
	      this.fishes.push(new AIFish({ game: this, width: player.width * 0.8 }));
	    }
	    this.moveFishes(time);
	    this.checkCollisions();
	    if (key.getPressedKeyCodes().length === 0 && player) {
	      player.decelerate();
	    }
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
	    this.height = options.height || options.width / 2;
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
/* 5 */
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
	
	    this.state = { isInvicible: false, color: 1 };
	  }
	
	  collideWith(otherFish) {
	
	
	      if (this.isBiggerThan(otherFish)) {
	
	        this.width += otherFish.width * .15;
	        this.height = this.width / 2;
	        this.game.remove(otherFish);
	        this.game.respawnFish();
	        this.game.score += Math.floor(otherFish.width * .15);
	        if (this.width > 1000) {
	          alert('500 bonus points! Bonus life and rebirth!');
	          this.game.score += 500;
	          this.width = 50;
	          this.height = 25;
	          this.pos = [500, 300];
	          this.brake();
	          this.game.lives++;
	        }
	
	      } else {
	        if (this.state.isInvicible) {
	          return;
	        } else {
	        const munch = new Audio('./sound/chomp.wav');
	        munch.play();
	        this.respawn();
	        this.game.lives--;
	        this.game.isOver();
	        if (this.game.lives) {
	          const invincible = new Audio('./sound/invincible.mp3');
	          invincible.play();
	        }
	      }
	    }
	  }
	
	  respawn() {
	    this.width = this.width * .75;
	    this.height = this.width / 2;
	    this.pos = [500, 300];
	    this.brake();
	    this.state.isInvicible = true;
	    window.setTimeout(() => {
	      this.state.isInvicible = false;
	    }, 6000);
	  }
	
	  swim(stroke) {
	    if ( Math.abs(this.vel[0]) < 6 || ((this.vel[0] ^ stroke[0]) < 0)) {
	      this.vel[0] += stroke[0];
	    }
	    if ( Math.abs(this.vel[1]) < 4.5 || ((this.vel[1] ^ stroke[1]) < 0)) {
	      this.vel[1] += stroke[1];
	    }
	  }
	
	  brake() {
	    this.vel = [0, 0];
	  }
	
	  draw(context) {
	    this.image = new Image();
	    if (this.state.isInvicible) {
	      if (this.vel[0] < 0) {
	        this.image.src = "images/super_shark_flipped.png";
	      } else {
	        this.image.src = "images/super_shark.png";
	      }
	
	    } else {
	      if (this.vel[0] < 0) {
	        this.image.src = "images/shark_flipped.png";
	      } else {
	        this.image.src = "images/shark.png";
	      }
	    }
	    context.drawImage(this.image,
	       this.pos[0], this.pos[1],
	        this.width, this.height);
	  }
	
	  decelerate() {
	    this.vel[0] = this.vel[0] * .9;
	    this.vel[1] = this.vel[1] * .9;
	  }
	}
	
	module.exports = PlayerFish;


/***/ },
/* 6 */
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
	    key('q', () => { player.brake(); });
	    key('e', () => { player.brake(); });
	  }
	}
	
	GameView.MOVES = {
	  "w": [ 0, -1.5],
	  "a": [-2,  0],
	  "s": [ 0,  1.5],
	  "d": [ 2,  0],
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map