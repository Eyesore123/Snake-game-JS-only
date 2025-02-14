const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const cogcontainer = document.getElementById('cogcontainer');
let soundEnabled = true;

let soundtrack = new Audio('/Assets/soundtrack.mp3');
soundtrack.loop = true;
soundtrack.currentTime = 9.5;

const eatSound = new Audio('/Assets/eat.mp3');
if (localStorage.getItem('eatSoundVolume')) {
    eatSound.volume = parseFloat(localStorage.getItem('eatSoundVolume'));
} else {
    eatSound.volume = 0.2;
}

if (localStorage.getItem('soundtrackVolume')) {
    soundtrack.volume = parseFloat(localStorage.getItem('soundtrackVolume'));
} else {
    soundtrack.volume = 0.15;
}

const gameOverSound = new Audio('/Assets/lose.mp3');
gameOverSound.volume = 0.6;

const backgroundImages = [
    './Assets/snake.webp',
    './Assets/snake_2.webp',
    './Assets/snake_3.webp',
    './Assets/snake_4.webp',
    './Assets/snake_5.webp',
    './Assets/snake_6.webp',
    './Assets/snake_7.webp',
    './Assets/snake_8.webp'
];

function preloadImages() {
    backgroundImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

document.addEventListener('DOMContentLoaded', preloadImages);

function initStyles() {

    document.getElementById('gameCanvas').style.opacity = 1;
    document.getElementById('score').style.display = 'block';
    document.getElementById('title').style.display = 'none';
    // In case text on top starts to cause problems:
    // document.getElementById('footertext').style.display = 'flex';
    document.getElementById('footer').style.display = 'flex';
    document.getElementById('cogcontainer').style.setProperty('bottom', '10px', 'important');

    const controls = document.getElementById('controlcontainer');
    controls.style.display = 'flex';
}

let gameStarted = false;

let snake = [];
let food = {};
let gameOverFlag = false;

// Movement variables (speed on the x and y axis)
// Only one can be active at a time, otherwise the snake would move diagonally
let dx = 0;
let dy = 0;

let score = 0;

// Grid size = the size of one unit of grid in pixels!
let gridSize;
if (localStorage.getItem('gridSize')) {
    const switchlabel = document.querySelectorAll('.switchlabel');
    gridSize = parseInt(localStorage.getItem('gridSize'));
    if(gridSize === 20) {
        document.getElementById('switch-radio1').value = 'small';
        switchlabel[0].classList.add('active');
        switchlabel[1].classList.remove('active');
        switchlabel[2].classList.remove('active');
    } else if(gridSize === 15) {
        document.getElementById('switch-radio2').value = 'medium';
        switchlabel[1].classList.add('active');
        switchlabel[0].classList.remove('active');
        switchlabel[2].classList.remove('active');
    } else if(gridSize === 10) {
        document.getElementById('switch-radio3').value = 'large';
        switchlabel[2].classList.add('active');
        switchlabel[0].classList.remove('active');
        switchlabel[1].classList.remove('active');
    }
} else {
    gridSize = 20;
}

document.querySelectorAll('.switchlabel input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'small') {
            gridSize = 20;
            localStorage.setItem('gridSize', 20);
        } else if (this.value === 'medium') {
            gridSize = 15;
            localStorage.setItem('gridSize', 15);
        } else if (this.value === 'large') {
            gridSize = 10;
            localStorage.setItem('gridSize', 10);
        }
        // Trigger game board redraw here
        drawGame();
    });
});

let over = false;
let paused = false;

// Movement happens in intervals. When the game ends, the interval is cleared.
let moveSpeed = 200;
let moveInterval;
function updateSpeed() {
    if (score >= 700) {
        moveSpeed = 110;
    } else if (score >= 600) {
        moveSpeed = 120;
    } else if (score >= 500) {
        moveSpeed = 130;
    } else if (score >= 400) {
        moveSpeed = 140;
    } else if (score >= 300) {
        moveSpeed = 150;
    } else if (score >= 200) {
        moveSpeed = 165;
    } else if (score >= 100) {
        moveSpeed = 180;
    } else {
        moveSpeed = 200;
    }
}

function updateGameSpeed() {
    updateSpeed();

    clearInterval(moveInterval);
    moveInterval = setInterval(moveSnake, moveSpeed);
    //console.log(moveSpeed);
}

// Debounce function to prevent rapid clicks / not a good approach for game mechanics

// let lastKeyPressTime = 0;
// const debounceTime = 200;

// function debounceHandler(e) {
//     const currentTime = Date.now();
//     if (currentTime - lastKeyPressTime > debounceTime) {
//         handleKeyPress(e);
//         lastKeyPressTime = currentTime;
//     }
// }

// Change the background every 10 seconds
let backgroundInterval = setInterval(changeBackground, 10000);
function togglePause() {
    if (paused) {
        console.log("Paused");
        moveInterval = setInterval(moveSnake, moveSpeed);  // Restart the movement interval
    } else {
        clearInterval(moveInterval);  // Pause the game
    }
    paused = !paused;
}

function handleClick() {
    console.log("clicked");
    togglePause();
    console.log("Pause toggled");
}

// Event listeners
document.getElementById('gameCanvas').addEventListener('click', handleClick);

function initGame() {

    // Dynamic buttons:
    restartBtn.style.display = 'block';
    startBtn.style.display = 'none';
    landingpagefooter.style.display = "none";

    // Reset bg change interval

    clearInterval(backgroundInterval);
    moveInterval = setInterval(moveSnake, moveSpeed);
    
    // Reset game state
    gameStarted = true;

    if (localStorage.getItem('eatSoundVolume') !== null) {
    eatSound.volume = parseFloat(localStorage.getItem('eatSoundVolume'));
    }
    
    paused = false;
    over = false;
    snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
    dx = 1;  // Initial movement speed
    dy = 0;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;

    placeFood();
    if (gameOverFlag) {
        flashCanvas();
    } else {
        drawGame();
    }
}

function drawGame() {

    const body = document.body;
    // Background goes back to default when game starts:
    if (gameStarted) {
        if(body.style.backgroundImage !== "url('./Assets/snake.webp')" && score === 0) {
            body.style.backgroundImage = "url('./Assets/snake.webp')";
        }
    }

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Dynamic rendering of the snake where the color is determined by the index of the segment in the snake array
    for (let i = 0; i < snake.length; i++) {
        // If no color selected (no local storage value), use a default color
        if(!localStorage.getItem('snakeColor')) {
            ctx.fillStyle = `hsl(${60 * i}, 70%, 60%)`;
        } else {
            ctx.fillStyle = localStorage.getItem('snakeColor');
        }
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);

         // Eyes
        if (i === 0 && !document.getElementById('removeEyes').checked) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(snake[i].x * gridSize + gridSize / 2 - 4, snake[i].y * gridSize + gridSize / 2, 3, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(snake[i].x * gridSize + gridSize / 2 - 4, snake[i].y * gridSize + gridSize / 2, 1.5, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(snake[i].x * gridSize + gridSize / 2 + 3, snake[i].y * gridSize + gridSize / 2, 3, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(snake[i].x * gridSize + gridSize / 2 + 3, snake[i].y * gridSize + gridSize / 2, 1.5, 0, 2 * Math.PI);
            ctx.fill();
        }

        if (i === 0 && !document.getElementById('removeEyes').checked) {
            // Distance to food
            const distX = Math.abs(snake[0].x - food.x);
            const distY = Math.abs(snake[0].y - food.y);
            const isNearFood = distX <= 1 && distY <= 1;
            
            let tongueAngle = 0;
            if (dx === 1) tongueAngle = 0;
            if (dx === -1) tongueAngle = Math.PI;
            if (dy === -1) tongueAngle = -Math.PI/2;
            if (dy === 1) tongueAngle = Math.PI/2;
            
            //Draw tongue
            ctx.save();
            ctx.translate(snake[i].x * gridSize + gridSize/2, snake[i].y * gridSize + gridSize/2);
            ctx.rotate(tongueAngle);
            
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.moveTo(gridSize/2, 0);
            
            //Wiggle
            const wiggle = Math.sin(Date.now() / 100) * 2;
            if (isNearFood) {
                // Extended tongue
                ctx.lineTo(gridSize * 0.8, wiggle);
                ctx.moveTo(gridSize * 0.8, wiggle);
                ctx.lineTo(gridSize, wiggle - 3);
                ctx.moveTo(gridSize * 0.8, wiggle);
                ctx.lineTo(gridSize, wiggle + 3);
            } else {
                // Normal
                ctx.lineTo(gridSize * 0.6, wiggle);
                ctx.moveTo(gridSize * 0.6, wiggle);
                ctx.lineTo(gridSize * 0.7, wiggle - 2);
                ctx.moveTo(gridSize * 0.6, wiggle);
                ctx.lineTo(gridSize * 0.7, wiggle + 2);
            }
            ctx.stroke();
            ctx.restore();
            
            // Mouth appears
            if (isNearFood) {
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(snake[i].x * gridSize + gridSize/2, snake[i].y * gridSize + gridSize/2 + 2, 3, 0, Math.PI);
                ctx.fill();
            }
        }
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // Grid line colors and thickness
    ctx.strokeStyle = '';
    for (let i = 0; i <= canvas.width / gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

function placeFood() {
    let validFood = false;
    while (!validFood) {
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };

        validFood = true;
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                validFood = false;
                break;
            }
        }
    }
}

function restartGame() {
    soundtrack2.currentTime = 0;
    clearInterval(flashInterval);
    clearInterval(moveInterval); // Clear the previous interval
    directionQueue = [];
    // Reset soundtrack to original state
    soundtrack.pause();
    soundtrack = new Audio('/Assets/soundtrack.mp3');
    soundtrack.loop = true;
    soundtrack.currentTime = 9.5;
    soundtrack.volume = volumeSlider.value;
    
    // Reset audio connections
    source = audioContext.createMediaElementSource(soundtrack);
    source.connect(analyser);
    soundtrack.play();
    soundtrack2playing = false;
    audioContext.resume();
    analyzeAudio();

    footer.style.display = 'flex';
    snake = [];
    score = 0;
    over = false;
    scoreElement.textContent = `Score: ${score}`;
    document.getElementById('gameOver').style.display = 'none';
    gameOverFlag = false;
    initGame();
}

// Variables to store movement directions
let directionQueue = [];

// Modified key press handler to handle queue direction
// Modified key press handler to handle queue direction
function handleKeyPress(e) {
    const direction = getDirectionFromKey(e.key);
    
    if (direction) {
        if (!isOppositeDirection(direction)) {
            if (directionQueue.length < 2) {
                directionQueue.push(direction);
            } else {
                directionQueue.shift();
                directionQueue.push(direction);
            }
        }
    }
}

let reverseControls = false;

function getDirectionFromKey(key) {
    if (reverseControls) {
        switch (key) {
            case 'ArrowUp':
                return { dx: 0, dy: 1 };
            case 'ArrowDown':
                return { dx: 0, dy: -1 };
            case 'ArrowLeft':
                return { dx: 1, dy: 0 };
            case 'ArrowRight':
                return { dx: -1, dy: 0 };
            default:
                return null;
        }
    } else {
        switch (key) {
            case 'ArrowUp':
                return { dx: 0, dy: -1 };
            case 'ArrowDown':
                return { dx: 0, dy: 1 };
            case 'ArrowLeft':
                return { dx: -1, dy: 0 };
            case 'ArrowRight':
                return { dx: 1, dy: 0 };
            default:
                return null;
        }
    }
}

// Mobile controls
const leftButton = document.querySelector('#controllerleftleft');
const rightButton = document.querySelector('#controlleftright');
const upButton = document.querySelector('#controllerrighttup');
const downButton = document.querySelector('#controllerrightdown');

leftButton.addEventListener('click', () => {
  const leftArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
  document.dispatchEvent(leftArrowEvent);
});

rightButton.addEventListener('click', () => {
  const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
  document.dispatchEvent(rightArrowEvent);
});

upButton.addEventListener('click', () => {
  const upArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
  document.dispatchEvent(upArrowEvent);
});

downButton.addEventListener('click', () => {
  const downArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
  document.dispatchEvent(downArrowEvent);
});

function isOppositeDirection(newDirection) {
    return (newDirection.dx === -dx && newDirection.dy === 0) ||
           (newDirection.dy === -dy && newDirection.dx === 0);
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
            break;
        case 's':
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
            break;
        case 'a':
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
            break;
        case 'd':
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
            break;
    }
            
});

// Move the snake and apply direction changes from the queue
function moveSnake() {
    if (!gameStarted || paused) return;
    updateGameSpeed();
    // Apply the next direction in the queue if available
    if (directionQueue.length > 0) {
        const nextDirection = directionQueue.shift();
        dx = nextDirection.dx;
        dy = nextDirection.dy;
        console.log(dx, dy);
    }

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // With these settings the game ends if the snake runs into a wall.

    // if (head.x < 0 || head.x >= canvas.width / gridSize ||
    //     head.y < 0 || head.y >= canvas.height / gridSize) {
    //     over = true;
    //     if(over === true) {
    //         document.getElementById('gameOver').style.display = 'flex';
    //     }
    //     clearInterval(moveInterval);
    // }

    // Check for collision with self

    // If modulo is used here, medium grid size gets buggy
    // after crossing the border.

    // if ((head.x < 0) || (head.x >= canvas.width / gridSize) || (head.y < 0) ||  (head.y >= canvas.height / gridSize)) {
    //     head.x = (head.x + canvas.width / gridSize) % (canvas.width / gridSize);
    //     head.y = (head.y + canvas.height / gridSize) % (canvas.height / gridSize);
    // }

    if (head.x < 0) {
        head.x = Math.floor(canvas.width / gridSize) - 1;
    } else if (head.x >= canvas.width / gridSize) {
        head.x = 0;
    }
    
    if (head.y < 0) {
        head.y = Math.floor(canvas.height / gridSize) - 1;
    } else if (head.y >= canvas.height / gridSize) {
        head.y = 0;
    }

    const footer = document.getElementById('footer');

    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y && snake.length > 3) {
            over = true;
            if (over === true) {
                footer.style.display = 'none';
                gameOverSound.play();
                document.getElementById('gameOver').style.display = 'flex';
                gameOverFlag = true;
                directionQueue = [];
                console.log("Game Over flag set to true");
                flashCanvas();
                clearInterval(moveInterval);
                if (activeGamepad) {
                    triggerTremble(activeGamepad, 0.2, 0.8, 500);
                    }
            }
            clearInterval(moveInterval);
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        eatSound.play();

    if (score >= 290 && !soundtrack2playing) {
        console.log("Switching to soundtrack 2");
        soundtrack.pause();
        soundtrack2.play().then(() => {
            soundtrack2.volume = volumeSlider.value;
            soundtrack2playing = true;
            console.log("Soundtrack 2 is playing.");
            source.disconnect(analyser);
            source2.connect(analyser);
            source = source2;
            soundtrack = soundtrack2;
            analyzeAudio();
        }).catch(error => {
            console.error("Error playing soundtrack 2:", error);
        });
    }
    
    if (score < 20 && soundtrack2playing) {
        console.log("Switching back to soundtrack 1");
        soundtrack2.pause().then(() => {
            soundtrack.play().then(() => {
                soundtrack.volume = volumeSlider.value;
                soundtrack2playing = false;
                console.log("Soundtrack 1 is playing.");
                source2.disconnect(analyser);
                source.connect(analyser);
                analyzeAudio();
            }).catch(error => {
                console.error("Error playing soundtrack 1:", error);
            });
        }).catch(error => {
            console.error("Error pausing soundtrack 2:", error);
        });
    }

    if (activeGamepad) {
    triggerTremble(activeGamepad, 0.2, 0.8, 50);
    }

    score += 10;
    console.log("Score:", score);
    if (score === 100 || score === 200 || score === 300 || score === 400 || score === 500) {
        changeBackgroundInGame(score);
    }
    updateGameSpeed();
    scoreElement.textContent = `Score: ${score}`;
    placeFood();

    } else {
        snake.pop();
    }

    drawGame();
}

let flashInterval;

function flashCanvas() {
    console.log("Flashing canvas...");
    let flashing = true;
    flashInterval = setInterval(() => {
        if (flashing) {
            ctx.fillStyle = `rgb(255, 255, 255, 0.3)`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            drawGame();
        }
        flashing = !flashing;
    }, 1100);
}

document.addEventListener('keydown', handleKeyPress);

startBtn.addEventListener('click', initGame);

// Starts music on mobile screen touch

startBtn.addEventListener('touchstart', function() {
    soundtrack.play();
    audioContext.resume();
})

let currentBackground = 1;

function changeBackground() {
    if (gameStarted) return;
    const body = document.body;

    if (currentBackground === 1) {
    body.style.backgroundImage = "url('./Assets/snake_2.webp')";
    currentBackground = 2;
    } else if (currentBackground === 2) {
    body.style.backgroundImage = "url('./Assets/snake_3.webp')";
    currentBackground = 3;
    } else if (currentBackground === 3) {
    body.style.backgroundImage = "url('./Assets/snake_4.webp')";
    currentBackground = 4;
    } else if (currentBackground === 4) {
    body.style.backgroundImage = "url('./Assets/snake_5.webp')";
    currentBackground = 5;
    } else if (currentBackground === 5) {
    body.style.backgroundImage = "url('./Assets/snake_6.webp')";
    currentBackground = 6;
    } else if (currentBackground === 6) {
    body.style.backgroundImage = "url('./Assets/snake_7.webp')";
    currentBackground = 7;
    } else if (currentBackground === 7) {
    body.style.backgroundImage = "url('./Assets/snake_8.webp')";
    currentBackground = 8;
    } else {
    body.style.backgroundImage = "url('./Assets/snake.webp')";
    currentBackground = 1;
    }
}

function changeBackgroundInGame(score) {
    clearInterval(backgroundInterval);
    console.log('changeBackground called');
    const body = document.body;
    let imageIndex;

    console.log(`Score: ${score}`);

    // Determine the image index based on the score ranges
    if (score >= 800) {
        imageIndex = 7;
        clearInterval(moveInterval);
    } else if (score >= 700) {
        imageIndex = 6;
        clearInterval(moveInterval);
    } else if (score >= 500) {
        imageIndex = 5;
        clearInterval(moveInterval);
    } else if (score >= 400) {
        imageIndex = 4;
        clearInterval(moveInterval);
    } else if (score >= 300) {
        imageIndex = 3;
        clearInterval(moveInterval);
    } else if (score >= 200) {
        imageIndex = 2;
        clearInterval(moveInterval);
    } else if (score >= 100) {
        imageIndex = 1; // snake_2.webp
        clearInterval(moveInterval);
    } else {
        imageIndex = 0; // snake.webp (default background)
    }

    // Update the background image
    body.style.background = `url('${backgroundImages[imageIndex]}')`;
    body.style.backgroundRepeat = "no-repeat";
    body.style.backgroundPosition = "center center";
    body.style.backgroundSize = "cover";
    console.log(`Background image updated to: ${backgroundImages[imageIndex]}`);
    console.log(currentBackground);
}

function handleSoundToggle() {

    const soundButton1 = document.getElementById('soundicon1');
    const soundButton2 = document.getElementById('soundicon2');
    
    if (soundEnabled) {
        soundtrack.pause();
        eatSound.volume = 0;
        gameOverSound.volume = 0;
        soundButton1.style.display = 'none';
        soundButton2.style.display = 'block';
    } else {
        soundtrack.play();
        eatSound.volume = 0.2;
        gameOverSound.volume = 0.6;
        soundButton2.style.display = 'none';
        soundButton1.style.display = 'block';

    }
soundEnabled = !soundEnabled;
}

//Tremble toggle:

const audio = document.getElementById('soundtrack');
const volumeSlider = document.getElementById('soundtrackVolume');
const trembleToggle = document.getElementById('trembleToggle');

const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Cross-browser support
const analyser = audioContext.createAnalyser();
let soundtrack2playing = false;
let soundtrack2 = new Audio('/Assets/soundtrack2.mp3');
soundtrack2.loop = true;
let source = audioContext.createMediaElementSource(soundtrack);
let source2 = audioContext.createMediaElementSource(soundtrack2);
source.connect(analyser);
analyser.connect(audioContext.destination);
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});

const applyButton = document.getElementById('applyBtn');

    function analyzeAudio() {
        if (analyser && analyser.getByteFrequencyData) {
            analyser.getByteFrequencyData(dataArray);
    
            const bass = dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
    
            if (trembleToggle.checked && bass > 200) {
                document.body.classList.add('tremble');
            } else {
                document.body.classList.remove('tremble');
            }
        } else {
            console.error('analyser is not valid');
        }
    
        requestAnimationFrame(analyzeAudio);
    }

applyButton.addEventListener('click', () => {
    if (trembleToggle.checked) {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        analyzeAudio();
    } else {
        document.body.classList.remove('tremble');
    }
});

analyzeAudio();

// eatSound.volume = 0.2;
// soundtrack.volume = 0.15;

// Framerate counter for testing purposes:

// let lastTime = 0;
// const maxFPS = 60;
// let fps = 0;
// let fpsCounter = 0;
// let lastFPSUpdate = 0;

// function update(time) {
//   const delta = time - lastTime;
//   if (delta < 1000 / maxFPS) return;
//   lastTime = time;
//   fpsCounter++;
//   if (time - lastFPSUpdate >= 1000) {
//     fps = fpsCounter;
//     fpsCounter = 0;
//     lastFPSUpdate = time;
//   }
//   // Update game state here
//   document.getElementById('fps').innerText = `FPS: ${fps}`;
//   requestAnimationFrame(update);
// }

// // Get the FPS from the canvas
// function getFPS() {
//   return fps;
// }

// // Update the FPS display
// setInterval(() => {
//   document.getElementById('fps').innerText = `FPS: ${getFPS()}`;
// }, 1000);

// update();

// Structure for game loop:

// function gameLoop() {
//     drawGame();
//     moveSnake();
//     // Other game logic here
//     requestAnimationFrame(gameLoop);
//   }
  
//   function initGame() {
//     // Initialization code here
//     gameLoop();
//   }
  
//   function flashGame() {
//     // Flash game code here
//     gameLoop();
//   }
