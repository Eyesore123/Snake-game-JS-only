function initStyles() {
    document.getElementById('gameCanvas').style.opacity = 1;
    document.getElementById('score').style.display = 'block';
    document.getElementById('title').style.display = 'none';
    document.getElementById('footertext').style.display = 'flex';

    const controls = document.getElementById('controlcontainer');
    // Show container at start only if the viewport is small enough
    if (window.innerWidth < 469) {
        controls.style.display = 'flex';
    } else {
        controls.style.display = 'none';
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

let gameStarted = false;
let snake = [];
let food = {};

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
}

// Event listeners
document.getElementById('gameCanvas').addEventListener('click', handleClick);

function initGame() {
    // Dynamic buttons:
    restartBtn.style.display = 'block';
    startBtn.style.display = 'none';

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
    drawGame();
}

function drawGame() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Dynamic rendering of the snake where the color is determined by the index of the segment in the snake array
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = `hsl(${60 * i}, 70%, 60%)`;
        // Green color: ctx.fillStyle = `green`; 
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
    clearInterval(moveInterval); // Clear the previous interval
    snake = [];
    score = 0;
    over = false;
    scoreElement.textContent = `Score: ${score}`;
    document.getElementById('gameOver').style.display = 'none';
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
                // If more than 2 keys are pressed, only keep the last two
                directionQueue.shift(); // Remove the oldest
                directionQueue.push(direction); // Add the latest
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

function isOppositeDirection(newDirection) {
    return (newDirection.dx === -dx && newDirection.dy === 0) ||
           (newDirection.dy === -dy && newDirection.dx === 0);
}

// Move the snake and apply direction changes from the queue
function moveSnake() {
    if (!gameStarted || paused) return;

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

    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            over = true;
            if (over === true) {
                document.getElementById('gameOver').style.display = 'flex';
            }
            clearInterval(moveInterval);
            return;
        }
    }

    snake.unshift(head);

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        placeFood();
    } else {
        snake.pop();
    }

    drawGame();
}

document.addEventListener('keydown', handleKeyPress);

startBtn.addEventListener('click', initGame);

// Stylings for snake / buttons
//Random spawns
//Enemies
// Settings menu: food amount, snake speed, grid size, snake length etc.
//Game over effects
//Go back button above restart button
//Different difficulty modes
//Attach mobile buttons to game logic
// Sound effects?
// Leaderboard
// Controller support