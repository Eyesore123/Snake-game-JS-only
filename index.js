const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
let soundEnabled = true;
const soundtrack = new Audio('/Assets/soundtrack.mp3');
soundtrack.loop = true;
soundtrack.currentTime = 9.5;
soundtrack.volume = 0.15;

const eatSound = new Audio('/Assets/eat.mp3');
eatSound.volume = 0.2;
const gameOverSound = new Audio('/Assets/lose.mp3');
gameOverSound.volume = 0.6;

const backgroundImages = [
    './Assets/snake.webp',
    './Assets/snake_2.webp',
    './Assets/snake_3.webp',
    './Assets/snake_4.webp',
    './Assets/snake_5.webp',
    './Assets/snake_6.webp'
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
    document.getElementById('footertext').style.display = 'flex';
    document.getElementById('footer').style.display = 'flex';

    const controls = document.getElementById('controlcontainer');
    controls.style.display = 'flex';

    if (window.innerWidth < 469) {
        controls.style.display = 'flex';
    } else {
        controls.style.display = 'none';
    }
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
let gridSize = 20;
let over = false;
let paused = false;

// Movement happens in intervals. When the game ends, the interval is cleared.
let moveInterval;


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
    paused = !paused;
    if (paused) {
        clearInterval(moveInterval);
    } else {
        moveInterval = setInterval(moveSnake, 200);
    }
}

function handleClick() {
    console.log("clicked");
    togglePause();
    console.log("Pause toggled");
}

// Event listeners
document.getElementById('gameCanvas').addEventListener('click', handleClick);

function initGame() {
    soundtrack.play();
    // Dynamic buttons:
    restartBtn.style.display = 'block';
    startBtn.style.display = 'none';
    landingpagefooter.style.display = "none";

    // Reset bg change interval

    clearInterval(backgroundInterval);

    // Reset game state
    gameStarted = true;
    paused = false;
    over = false;
    snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
    dx = 1;  // Initial movement speed
    dy = 0;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;

    // Move the snake every 200 milliseconds (5 moves per second)
    clearInterval(moveInterval);
    moveInterval = setInterval(moveSnake, 200);

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
    body.style.backgroundImage = "url('./Assets/snake.webp')";
    }

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Dynamic rendering of the snake where the color is determined by the index of the segment in the snake array
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = `hsl(${60 * i}, 70%, 60%)`;
        // Green color snake: ctx.fillStyle = `green`; 
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
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
    clearInterval(flashInterval);
    clearInterval(moveInterval); // Clear the previous interval
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

// Modified key press handler to enqueue direction
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

function getDirectionFromKey(key) {
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

// Move the snake and apply direction changes from the queue
function moveSnake() {
    if (!gameStarted || paused) return;

    // if (score === 10) {
    //     paused = true;
        
    //     const warning = document.createElement('div');
    //     warning.textContent = "Speed increasing!";
    //     warning.style.position = 'absolute';
    //     warning.style.fontSize = '2em';
    //     warning.style.color = 'red';
    //     warning.style.top = '50%';
    //     warning.style.left = '50%';
    //     warning.style.transform = 'translate(-50%, -50%)';
    //     document.body.appendChild(warning);

    //     setTimeout(() => {
    //         paused = false;
    //         document.body.removeChild(warning);
    //         clearInterval(moveInterval);
    //         moveInterval = setInterval(moveSnake, 100); // Much faster!
    //     }, 1000); // Shorter pause
    // }

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
    if ((head.x < 0) || (head.x >= canvas.width / gridSize) || (head.y < 0) ||  (head.y >= canvas.height / gridSize)) {
        head.x = (head.x + canvas.width / gridSize) % (canvas.width / gridSize);
        head.y = (head.y + canvas.height / gridSize) % (canvas.height / gridSize);
    }

    const footer = document.getElementById('footer');

    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            over = true;
            if (over === true) {
                footer.style.display = 'none';
                gameOverSound.play();
                document.getElementById('gameOver').style.display = 'flex';
                gameOverFlag = true;
                console.log("Game Over flag set to true");
                flashCanvas();
            }
            clearInterval(moveInterval);
            return;
        }
    }

    snake.unshift(head);

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        eatSound.play();
        score += 10;
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

let currentBackground = 1;

function changeBackground() {
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
    } else {
    body.style.backgroundImage = "url('./Assets/snake.webp')";
    currentBackground = 1;
    }
}

function handleSoundToggle() {

    const soundButton1 = document.getElementById('soundicon1');
    const soundButton2 = document.getElementById('soundicon2');

    // Toggle the sound button icon
    

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

// Stylings for snake / buttons
//Random spawns
//Enemies
// Settings menu: food amount, snake speed, grid size, snake length etc.
//Go back button above restart button
//Different difficulty modes
// Leaderboard
// Customizable controls
// Customizable snake color
// Button configuration for tablets