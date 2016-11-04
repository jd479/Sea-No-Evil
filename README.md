# Sea No Evil

[Live][game]
[game]: http://jeffdu.com/Sea-No-Evil/


Sea No Evil is a JavaScript game based off of Fishy. The player starts out as a tiny shark in a tank that must eat smaller fish in order to grow in hopes of becoming the Tank Titan.

![gameplay]

## Technologies

The game is created using vanilla JavaScript to handle the logic of all the gameplay and HTML5's Canvas to animate objects as they move across the screen. The application also utilizes the KeyMaster library in order to receive feedback from the user (through keys WASD).

_Reading commands from the user:_
```javascript
  bindKeyHandler() {
    const player = this.player;
    Object.keys(GameView.MOVES).forEach((k) => {
      let move = GameView.MOVES[k];
      key(k, () => { player.swim(move); });
    });
    key('q', () => { player.brake(); });
    key('e', () => { player.brake(); });
  }

  GameView.MOVES = {
    "w": [ 0, -2.5],
    "a": [-3.5,  0],
    "s": [ 0,  2.5],
    "d": [ 3.5,  0],
    "up": [ 0, -2.5],
    "left": [-3.5,  0],
    "down": [ 0,  2.5],
    "right": [ 3.5,  0]
  };
```

## Future direction:

0. Implement power-ups that the user can collect in order have more dynamic gameplay.
0. Install a system that allows the user to customize the appearance of their player model.

[gameplay]: ./images/gameplay.gif
