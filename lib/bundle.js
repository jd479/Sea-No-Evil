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
	const GameView = __webpack_require__(7);
	
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
	const VanillaModal = __webpack_require__(6);
	
	class Game {
	  constructor() {
	    this.fishes = [];
	    this.player = [];
	    this.score = 0;
	    this.populateFish();
	    this.lives = 3;
	    this.highScore = 0;
	  }
	
	  isOver() {
	    if (this.lives < 1) {
	      if (confirm(`You earned: ${this.score} points, want to play again?`)) {
	        this.restart();
	      } else {
	        this.remove(this.player[0]);
	      }
	    }
	  }
	
	  restart() {
	    const player = this.player[0];
	    this.lives = 3;
	    this.score = 0;
	    player.pos = [Game.DIM_X /2, Game.DIM_Y / 2];
	    player.brake();
	    player.width = 50;
	    player.height = 25;
	    this.fishes = [];
	    this.populateFish();
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
	    while (y < 400 && y > 200 || y > 950){
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
	    if (this.score > this.highScore) {
	      this.highScore = this.score;
	    }
	    score.innerHTML = `lives: ${this.lives} score: ${this.score} high score: ${this.highScore}`;
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
	    options.width = options.width || 250 * Math.random() + 25;
	    options.vel = [150 / options.width * dir, 0];
	
	    const image = new Image();
	
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
	        this.width * 1.12, this.height * 1.12);
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
	    debugger
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
	    this.pos = [500, 300];
	    this.brake();
	    this.state.isInvicible = true;
	    window.setTimeout(() => {
	      this.state.isInvicible = false;
	    }, 6000);
	  }
	
	  swim(stroke) {
	    if (stroke[0]) {
	      this.vel[0] = stroke[0];
	    }
	    if (stroke[1]) {
	      this.vel[1] = stroke[1];
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
	    this.vel[0] = this.vel[0] * .84;
	    this.vel[1] = this.vel[1] * .84;
	    if (Math.abs(this.vel[0]) < 0.5) {
	      this.vel[0] *= .1;
	    }
	    if (Math.abs(this.vel[1]) < 0.5) {
	      this.vel[1]=0;
	    }
	  }
	}
	
	module.exports = PlayerFish;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== "undefined") {
	    factory(module, exports);
	  } else {
	    var mod = {
	      exports: {}
	    };
	    factory(mod, mod.exports);
	    global.VanillaModal = mod.exports;
	  }
	})(this, function (module, exports) {
	  'use strict';
	
	  Object.defineProperty(exports, "__esModule", {
	    value: true
	  });
	
	  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	    return typeof obj;
	  } : function (obj) {
	    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
	  };
	
	  function _classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  }
	
	  var _createClass = function () {
	    function defineProperties(target, props) {
	      for (var i = 0; i < props.length; i++) {
	        var descriptor = props[i];
	        descriptor.enumerable = descriptor.enumerable || false;
	        descriptor.configurable = true;
	        if ("value" in descriptor) descriptor.writable = true;
	        Object.defineProperty(target, descriptor.key, descriptor);
	      }
	    }
	
	    return function (Constructor, protoProps, staticProps) {
	      if (protoProps) defineProperties(Constructor.prototype, protoProps);
	      if (staticProps) defineProperties(Constructor, staticProps);
	      return Constructor;
	    };
	  }();
	
	  var VanillaModal = function () {
	
	    /**
	     * @param {Object} [userSettings]
	     */
	
	    function VanillaModal(userSettings) {
	      _classCallCheck(this, VanillaModal);
	
	      this.$$ = {
	        modal: '.modal',
	        modalInner: '.modal-inner',
	        modalContent: '.modal-content',
	        open: '[rel="modal:open"]',
	        close: '[rel="modal:close"]',
	        page: 'body',
	        class: 'modal-visible',
	        loadClass: 'vanilla-modal',
	        clickOutside: true,
	        closeKeys: [27],
	        transitions: true,
	        transitionEnd: null,
	        onBeforeOpen: null,
	        onBeforeClose: null,
	        onOpen: null,
	        onClose: null
	      };
	
	      this._applyUserSettings(userSettings);
	      this.error = false;
	      this.isOpen = false;
	      this.current = null;
	      this.open = this._open.bind(this);
	      this.close = this._close.bind(this);
	      this.$$.transitionEnd = this._transitionEndVendorSniff();
	      this.$ = this._setupDomNodes();
	
	      if (!this.error) {
	        this._addLoadedCssClass();
	        this._events().add();
	      } else {
	        console.error('Please fix errors before proceeding.');
	      }
	    }
	
	    /**
	     * @param {Object} userSettings
	     */
	
	
	    _createClass(VanillaModal, [{
	      key: '_applyUserSettings',
	      value: function _applyUserSettings(userSettings) {
	        if ((typeof userSettings === 'undefined' ? 'undefined' : _typeof(userSettings)) === 'object') {
	          for (var i in userSettings) {
	            if (userSettings.hasOwnProperty(i)) {
	              this.$$[i] = userSettings[i];
	            }
	          }
	        }
	      }
	    }, {
	      key: '_transitionEndVendorSniff',
	      value: function _transitionEndVendorSniff() {
	        if (this.$$.transitions === false) return;
	        var el = document.createElement('div');
	        var transitions = {
	          'transition': 'transitionend',
	          'OTransition': 'otransitionend',
	          'MozTransition': 'transitionend',
	          'WebkitTransition': 'webkitTransitionEnd'
	        };
	        for (var i in transitions) {
	          if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
	            return transitions[i];
	          }
	        }
	      }
	    }, {
	      key: '_getNode',
	      value: function _getNode(selector, parent) {
	        var targetNode = parent || document;
	        var node = targetNode.querySelector(selector);
	        if (!node) {
	          this.error = true;
	          return console.error(selector + ' not found in document.');
	        }
	        return node;
	      }
	    }, {
	      key: '_setupDomNodes',
	      value: function _setupDomNodes() {
	        var $ = {};
	        $.modal = this._getNode(this.$$.modal);
	        $.page = this._getNode(this.$$.page);
	        $.modalInner = this._getNode(this.$$.modalInner, this.modal);
	        $.modalContent = this._getNode(this.$$.modalContent, this.modal);
	        return $;
	      }
	    }, {
	      key: '_addLoadedCssClass',
	      value: function _addLoadedCssClass() {
	        this._addClass(this.$.page, this.$$.loadClass);
	      }
	    }, {
	      key: '_addClass',
	      value: function _addClass(el, className) {
	        if (el instanceof HTMLElement === false) return;
	        var cssClasses = el.className.split(' ');
	        if (cssClasses.indexOf(className) === -1) {
	          cssClasses.push(className);
	        }
	        el.className = cssClasses.join(' ');
	      }
	    }, {
	      key: '_removeClass',
	      value: function _removeClass(el, className) {
	        if (el instanceof HTMLElement === false) return;
	        var cssClasses = el.className.split(' ');
	        if (cssClasses.indexOf(className) > -1) {
	          cssClasses.splice(cssClasses.indexOf(className), 1);
	        }
	        el.className = cssClasses.join(' ');
	      }
	    }, {
	      key: '_setOpenId',
	      value: function _setOpenId() {
	        var id = this.current.id || 'anonymous';
	        this.$.page.setAttribute('data-current-modal', id);
	      }
	    }, {
	      key: '_removeOpenId',
	      value: function _removeOpenId() {
	        this.$.page.removeAttribute('data-current-modal');
	      }
	    }, {
	      key: '_getElementContext',
	      value: function _getElementContext(e) {
	        if (e && typeof e.hash === 'string') {
	          return document.querySelector(e.hash);
	        } else if (typeof e === 'string') {
	          return document.querySelector(e);
	        } else {
	          return console.error('No selector supplied to open()');
	        }
	      }
	    }, {
	      key: '_open',
	      value: function _open(matches, e) {
	        this._releaseNode();
	        this.current = this._getElementContext(matches);
	        if (this.current instanceof HTMLElement === false) return console.error('VanillaModal target must exist on page.');
	        if (typeof this.$$.onBeforeOpen === 'function') this.$$.onBeforeOpen.call(this, e);
	        this._captureNode();
	        this._addClass(this.$.page, this.$$.class);
	        this._setOpenId();
	        this.isOpen = true;
	        if (typeof this.$$.onOpen === 'function') this.$$.onOpen.call(this, e);
	      }
	    }, {
	      key: '_detectTransition',
	      value: function _detectTransition() {
	        var css = window.getComputedStyle(this.$.modal, null);
	        var transitionDuration = ['transitionDuration', 'oTransitionDuration', 'MozTransitionDuration', 'webkitTransitionDuration'];
	        var hasTransition = transitionDuration.filter(function (i) {
	          if (typeof css[i] === 'string' && parseFloat(css[i]) > 0) {
	            return true;
	          }
	        });
	        return hasTransition.length ? true : false;
	      }
	    }, {
	      key: '_close',
	      value: function _close(e) {
	        if (this.isOpen === true) {
	          this.isOpen = false;
	          if (typeof this.$$.onBeforeClose === 'function') this.$$.onBeforeClose.call(this, e);
	          this._removeClass(this.$.page, this.$$.class);
	          var transitions = this._detectTransition();
	          if (this.$$.transitions && this.$$.transitionEnd && transitions) {
	            this._closeModalWithTransition(e);
	          } else {
	            this._closeModal(e);
	          }
	        }
	      }
	    }, {
	      key: '_closeModal',
	      value: function _closeModal(e) {
	        this._removeOpenId(this.$.page);
	        this._releaseNode();
	        this.isOpen = false;
	        this.current = null;
	        if (typeof this.$$.onClose === 'function') this.$$.onClose.call(this, e);
	      }
	    }, {
	      key: '_closeModalWithTransition',
	      value: function _closeModalWithTransition(e) {
	        var _closeTransitionHandler = function () {
	          this.$.modal.removeEventListener(this.$$.transitionEnd, _closeTransitionHandler);
	          this._closeModal(e);
	        }.bind(this);
	        this.$.modal.addEventListener(this.$$.transitionEnd, _closeTransitionHandler);
	      }
	    }, {
	      key: '_captureNode',
	      value: function _captureNode() {
	        if (this.current) {
	          while (this.current.childNodes.length > 0) {
	            this.$.modalContent.appendChild(this.current.childNodes[0]);
	          }
	        }
	      }
	    }, {
	      key: '_releaseNode',
	      value: function _releaseNode() {
	        if (this.current) {
	          while (this.$.modalContent.childNodes.length > 0) {
	            this.current.appendChild(this.$.modalContent.childNodes[0]);
	          }
	        }
	      }
	    }, {
	      key: '_closeKeyHandler',
	      value: function _closeKeyHandler(e) {
	        if (Object.prototype.toString.call(this.$$.closeKeys) !== '[object Array]' || this.$$.closeKeys.length === 0) return;
	        if (this.$$.closeKeys.indexOf(e.which) > -1 && this.isOpen === true) {
	          e.preventDefault();
	          this.close(e);
	        }
	      }
	    }, {
	      key: '_outsideClickHandler',
	      value: function _outsideClickHandler(e) {
	        if (this.$$.clickOutside !== true) return;
	        var node = e.target;
	        while (node && node != document.body) {
	          if (node === this.$.modalInner) return;
	          node = node.parentNode;
	        }
	        this.close(e);
	      }
	    }, {
	      key: '_matches',
	      value: function _matches(e, selector) {
	        var el = e.target;
	        var matches = (el.document || el.ownerDocument).querySelectorAll(selector);
	        for (var i = 0; i < matches.length; i++) {
	          var child = el;
	          while (child && child !== document.body) {
	            if (child === matches[i]) return child;
	            child = child.parentNode;
	          }
	        }
	        return null;
	      }
	    }, {
	      key: '_delegateOpen',
	      value: function _delegateOpen(e) {
	        var matches = this._matches(e, this.$$.open);
	        if (matches) {
	          e.preventDefault();
	          e.delegateTarget = matches;
	          return this.open(matches, e);
	        }
	      }
	    }, {
	      key: '_delegateClose',
	      value: function _delegateClose(e) {
	        if (this._matches(e, this.$$.close)) {
	          e.preventDefault();
	          return this.close(e);
	        }
	      }
	    }, {
	      key: '_events',
	      value: function _events() {
	
	        var _closeKeyHandler = this._closeKeyHandler.bind(this);
	        var _outsideClickHandler = this._outsideClickHandler.bind(this);
	        var _delegateOpen = this._delegateOpen.bind(this);
	        var _delegateClose = this._delegateClose.bind(this);
	
	        var add = function add() {
	          this.$.modal.addEventListener('click', _outsideClickHandler, false);
	          document.addEventListener('keydown', _closeKeyHandler, false);
	          document.addEventListener('click', _delegateOpen, false);
	          document.addEventListener('click', _delegateClose, false);
	        };
	
	        this.destroy = function () {
	          this.close();
	          this.$.modal.removeEventListener('click', _outsideClickHandler);
	          document.removeEventListener('keydown', _closeKeyHandler);
	          document.removeEventListener('click', _delegateOpen);
	          document.removeEventListener('click', _delegateClose);
	        };
	
	        return {
	          add: add.bind(this)
	        };
	      }
	    }]);
	
	    return VanillaModal;
	  }();
	
	  exports.default = VanillaModal;
	  module.exports = exports['default'];
	});


/***/ },
/* 7 */
/***/ function(module, exports) {

	class GameView {
	  constructor(game, ctx) {
	    this.ctx = ctx;
	    this.game = game;
	    this.player = this.game.addPlayer();
	  }
	
	  start() {
	    document.getElementById('modal').click();
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
	  "w": [ 0, -2.5],
	  "a": [-3.5,  0],
	  "s": [ 0,  2.5],
	  "d": [ 3.5,  0]
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map