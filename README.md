# Sea No Evil

## Background

Sea No Evil is a JavaScript game based off of Fishy. The player starts out as a tiny fish in a tank that must eat smaller fish in order to grow in hopes of becoming the Tank Titan.

## MVP

Users will be able to:

  0. move the fish around using the keyboard
  0. unlock achievements based on their success in the game
    0. costumes

The project will include:

  0. a modal for a brief tutorial of the game
  0. a production README

## Technologies

The game will implement:

  0. vanilla JavaScript
  0. `HTML5 Canvas` for fish model rendering

It will also have multiple scripts:

`ai_fish.js` handles the logic for creating an NPC fish.

`game_view.js` handles the rerendering of the game and binds the keys for player movement.

`game.js` handles the game logic to check if the game is over, populates the game with characters, and other general gameplay features.

`moving_fish.js` parent class for `AIFish` and `playerFish`.

`player_fish.js` handles the logic for the player's character, such as movement and interacting with other fish.

`sea_no_evil.js` entry file for webpack.

`util.js` handles wrapping of fish when moving off of screen. 

## Implementation Timeline

__Day 1__: Install all necessary packages downloaded and ready to use. Have the basic outline ready for the two script files. Have `webpack` running and saving successfully.

Goals:
  0. Render fish models and background after learning Canvas.

__Day 2__: Implement logic for reading keydown inputs from the user to move the user fish. Implement logic for "AI" fish (just horizontally).

Goals:
  0. Complete `fish.js` script file

__Day 3__: Implement logic for detecting if the game is over. Create modal for tutorial.

Goals:

  0. Complete `game.js`
  0. Make the game aesthetically pleasing

__Day 4__: Add costumes for the user to customize appearance.

## Bonus:

Collectible power-ups for more dynamic gameplay.
