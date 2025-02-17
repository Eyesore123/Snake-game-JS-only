# Snake Game

Welcome to the Snake Game! This classic arcade game is a timeless classic that challenges your reflexes and strategic thinking.

## Features

- **Classic Arcade Gameplay:** Experience the nostalgia of the original Snake game.
- **Stunning Graphics:** Enjoy the mesmerizing graphics that bring the game to life.
- **Easy Controls:** Use the arrow or wasd keys to control the snake's movement.
- **Smooth Gameplay:** Smooth gameplay that feels responsive and intuitive.
- **Score Tracking:** Keep track of your score as you progress through the game.
- **Game Over Screen:** See your final score.
- **Music and Sound Effects:** Amazing soundtracks, game sounds and customizable sound volume!
- **Changing Backgrounds:** Nice snake themed backgrounds that change as you progress through the game.
- **Mobile Compatibility:** Play the game on your mobile device (tablets and very small phone devices might not display correctly)
- **Gamepad Support:** Use a gamepad for an even more immersive experience. You can choose the level of vibration and / or use reversed controls.
- **Customizable Snake Color:** Choose the color of your liking!
- **Animated facial expressions:** Snake wiggles its tongue and opens its mouth when it eats.

## Known issues

* Ease-in-out effect of the background image doesn't work on Mozilla because view transitions API is not supported. There might be a workaround but that would require using pseudoelements and getting rid of the ease-in-out effect.
* Game can lead to game over suddenly in rare instances when some unknown combination of keys is pressed and the game over condition gets triggered prematurely. Basically what happens is that the snake gets longer than it's supposed to. What you see on the screen is always a bit behind and in some cases can get out of sync with user interaction. Direction queue array is used to prevent gameovers that get triggered in wrong places (it helps fast turns), but it doesn't do miracles. Erratic behaviour increases with higher speeds. I tried adding a cooldown between key presses to prevent unexpected game overs, but it didn't seem to help.


![snake_game2](https://github.com/user-attachments/assets/67f92ca1-3c2f-4061-a68d-472d3be7adbc)


![snake_game](https://github.com/user-attachments/assets/3d1b71c4-b47f-4c88-9c7c-94a64268d78b)

<img src="https://github.com/user-attachments/assets/d267a0a2-9d89-4afe-ba47-ed560b90d92c" width="400" />


Game sounds are from Zapsplat.

Soundtracks:

h6itam - FUNK OSCURO SUPERSLOWED

Vampire Survivors Soundtrack - Copper Green Intent (looping)

On Youtube:

<a href="https://www.youtube.com/watch?v=xmRVFNv_DGs">Soundtrack 1</a>

<a href="https://www.youtube.com/watch?v=p7qpWDSN7lM">Soundtrack 2</a>

## How this was written
* At first I had only canvas. Then I added a snake. Then I tried to get it move. After that I added food and collisions and the list goes on. If you want to do something similar, then start with the canvas, snake and general game mechanics. Declare global variables for movement and set up functions to organize the game logic. Then add the rest of the game elements and tinker as you go.

## What I learned during this project

* When there's movement involved (a game or something similar), always declare global movement variables for keeping track of changes in movement speed and direction.
* Effects and small details can be hard to get right (for example, default selectors and sliders from browser, audio API controls etc.) for unknown browser-related reasons. If you want near total control over things, that means you probably have to do it yourself from the beginning.
* This project made me think how much JavaScript is tied to browsers. At the same time it is a good and a bad thing. It's good because it's so easy to use many common APIs. It's bad because everything in-game is tied to how browsers work. I wonder how different it would be to build games in lower-level languages, and this project made me want to try other languages. This project also made me realize that good JavaScript is similar to other languages in structure. If you can write the same program in some other language, then I think you can write it better with JavaScript, too.    
* It would have been nice to think about scaling at the start of the coding process so there would've been less struggle with scaling for higher resolutions (mistakes were made).
* I started the project with setInterval() and then I switched to using requestAnimationFrame() because I wanted to try higher framerate. Higher framerate didn't do much, but at least I got the game working with requestAnimationFrame() and fps counter to track frames.
