# Snake Game

Welcome to the Snake Game! This classic arcade game is a timeless classic that challenges your reflexes and strategic thinking.

## Features

- **Classic Arcade Gameplay:** Experience the nostalgia of the original Snake game.
- **Stunning Graphics:** Enjoy the mesmerizing graphics that bring the game to life.
- **Easy Controls:** Use the arrow keys to control the snake's movement.
- **Smooth Gameplay:** Smooth gameplay that feels responsive and intuitive.
- **Score Tracking:** Keep track of your score as you progress through the game.
- **Game Over Screen:** See your final score.
- **Music and Sound Effects:** Amazing soundtrack, game sounds and customizable sound volume!
- **Changing Backgrounds:** Nice snake themed backgrounds that change as you progress through the game.
- **Mobile Compatibility:** Play the game on your mobile device (tablets and very small phone devices might not display correctly)
- **Gamepad Support:** Use a gamepad for an even more immersive experience.
- **Customizable Snake Color:** Choose the color of your liking!

## Planned improvements

* Better stylings for snake / buttons
* WASD-keys for controls
* Random spawns for snake
* Enemies
* Settings menu: snake speed, grid size etc.
* Better tablet compatibility
* Leaderboard
* Customizable controls
* A higher framerate by reorganizing game logic

## Known issues

* GameLoop function would be a good addition for controlling fps and logic flow, because currently unexpected things can happen when settings are changed during a game.
* Ease-in-out effect of the background image doesn't work on Mozilla because view transitions API is not supported. There might be a workaround but that would require using pseudoelements and getting rid of the ease-in-out effect.
* Game can lead to game over suddenly in rare instances when some unknown combination of keys is pressed and the game over condition gets triggered prematurely.


![snake_game2](https://github.com/user-attachments/assets/67f92ca1-3c2f-4061-a68d-472d3be7adbc)


![snake_game](https://github.com/user-attachments/assets/3d1b71c4-b47f-4c88-9c7c-94a64268d78b)

<img src="https://github.com/user-attachments/assets/d267a0a2-9d89-4afe-ba47-ed560b90d92c" width="400" />


Game sounds are from Zapsplat.

Soundtrack is h6itam - FUNK OSCURO SUPERSLOWED

On Youtube:

<a href="https://www.youtube.com/watch?v=xmRVFNv_DGs">Music</a>

## What I learned during this project

* When there's movement involved (a game or something similar), always declare global movement variables for keeping track of changes in movement speed and direction.
* Effects and small details can be hard to get right (for example, default selectors and sliders from browser, audio API controls etc.) for unknown browser-related reasons. If you want near total control over things, that means you probably have to do it yourself from the beginning.
* This project made me think how much JavaScript is tied to browsers and their behaviour. I wonder how different it would be to build games with lower-level languages.
* It would be nice to think about scaling during the building process so you don't have struggle with scaling for higher resolutions
