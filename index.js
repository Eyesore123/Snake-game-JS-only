function initStyles() {
    document.getElementById('gameCanvas').style.opacity = 1;
    document.getElementById('score').style.display = 'block';
    document.getElementById('title').style.display = 'none';
    document.getElementById('footertext').style.display = 'flex';
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
        ctx.fillStyle = `hsl(${120 * i}, 70%, 60%)`;
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

function moveSnake() {
    if (!gameStarted || paused) return;

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

    // An option to run through the walls:
    if ((head.x < 0) || (head.x >= canvas.width / gridSize) || (head.y < 0) ||  (head.y >= canvas.height / gridSize)) {
        head.x = (head.x + canvas.width / gridSize) % (canvas.width / gridSize);
        head.y = (head.y + canvas.height / gridSize) % (canvas.height / gridSize);
    }

    // Check for collision with itself
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

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        placeFood();
    } else {
        snake.pop();
    }

    drawGame();
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

function handleKeyPress(e) {
    switch (e.key) {
        // Return statement prevents the opposite movements
        case 'ArrowUp':
            if (dy === 1) return;
            dx = 0; dy = -1;
            break;
        case 'ArrowDown':
            if (dy === -1) return;
            dx = 0; dy = 1;
            break;
        case 'ArrowLeft':
            if (dx === 1) return;
            dx = -1; dy = 0;
            break;
        case 'ArrowRight':
            if (dx === -1) return;
            dx = 1; dy = 0;
            break;
    }
}

document.addEventListener('keydown', handleKeyPress);
startBtn.addEventListener('click', initGame);