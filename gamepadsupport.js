let gamepadIndex = null;
let controllerActive = false;

// Polling for gamepad inputs
function updateGamepad() {
    const gamepads = navigator.getGamepads();
    if (gamepadIndex !== null) {
        const gamepad = gamepads[gamepadIndex];

        if (gamepad) {
            const dPadUp = gamepad.buttons[12].pressed;
            const dPadDown = gamepad.buttons[13].pressed;
            const dPadLeft = gamepad.buttons[14].pressed;
            const dPadRight = gamepad.buttons[15].pressed;

            // Handling D-Pad input
            if (dPadUp) {
                enqueueDirection({ dx: 0, dy: -1 });
            } else if (dPadDown) {
                enqueueDirection({ dx: 0, dy: 1 });
            } else if (dPadLeft) {
                enqueueDirection({ dx: -1, dy: 0 });
            } else if (dPadRight) {
                enqueueDirection({ dx: 1, dy: 0 });
            }

            // Handling Analog Stick (Left Stick) input
            const leftStickX = gamepad.axes[0]; // Horizontal axis (-1 to 1)
            const leftStickY = gamepad.axes[1]; // Vertical axis (-1 to 1)

            // Set dead zone for analog stick to avoid accidental input
            const deadZone = 0.2;
            if (Math.abs(leftStickX) > deadZone || Math.abs(leftStickY) > deadZone) {
                if (Math.abs(leftStickX) > Math.abs(leftStickY)) {
                    if (leftStickX > 0) {
                        enqueueDirection({ dx: 1, dy: 0 }); // Move right
                    } else {
                        enqueueDirection({ dx: -1, dy: 0 }); // Move left
                    }
                } else {
                    if (leftStickY > 0) {
                        enqueueDirection({ dx: 0, dy: 1 }); // Move down
                    } else {
                        enqueueDirection({ dx: 0, dy: -1 }); // Move up
                    }
                }
            }
        }
    }
}

// Add direction to queue
function enqueueDirection(direction) {
    if (!isOppositeDirection(direction)) {
        if (directionQueue.length < 2) {
            directionQueue.push(direction);
        } else {
            directionQueue.shift();
            directionQueue.push(direction);
        }
    }
}

// Check for new gamepads being connected
window.addEventListener("gamepadconnected", (e) => {
    console.log("Gamepad connected:", e.gamepad);
    gamepadIndex = e.gamepad.index;
    controllerActive = true;
});

// Check for gamepads being disconnected
window.addEventListener("gamepaddisconnected", (e) => {
    console.log("Gamepad disconnected:", e.gamepad);
    gamepadIndex = null;
    controllerActive = false;
});

// Call this function in your game loop to update gamepad state
function gameLoop() {
    if (controllerActive) {
        updateGamepad();
    }
    moveSnake();
    // Call this function on every frame (like using requestAnimationFrame or setInterval)
    requestAnimationFrame(gameLoop);
}

gameLoop();
