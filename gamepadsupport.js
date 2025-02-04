let gamepadIndex = null;
let controllerActive = false;

// Add edge detection for start button!

// Polling for gamepad inputs
function updateGamepad() {
    const gamepads = navigator.getGamepads();
    if (gamepadIndex !== null) {
        const gamepad = gamepads[gamepadIndex];

        if (gamepad) {
            const dPadUp = gamepad.buttons[12].pressed;
            console.log(dPadUp);
            const dPadDown = gamepad.buttons[13].pressed;
            const dPadLeft = gamepad.buttons[14].pressed;
            const dPadRight = gamepad.buttons[15].pressed;
            const startButton = gamepad.buttons[9].pressed;

     
            if (dPadUp) {
                enqueueDirection({ dx: 0, dy: -1 });
            } else if (dPadDown) {
                enqueueDirection({ dx: 0, dy: 1 });
            } else if (dPadLeft) {
                enqueueDirection({ dx: -1, dy: 0 });
            } else if (dPadRight) {
                enqueueDirection({ dx: 1, dy: 0 });
            }

            // Toggle pause logic comes here (start button)

            if (startButton) {
                console.log("Start button pressed!");
                togglePause();
            }

           
            const leftStickX = gamepad.axes[0]; 
            const leftStickY = gamepad.axes[1];

            
            const deadZone = 0.2;
            if (Math.abs(leftStickX) > deadZone || Math.abs(leftStickY) > deadZone) {
                if (Math.abs(leftStickX) > Math.abs(leftStickY)) {
                    if (leftStickX > 0) {
                        enqueueDirection({ dx: 1, dy: 0 });
                    } else {
                        enqueueDirection({ dx: -1, dy: 0 }); 
                    }
                } else {
                    if (leftStickY > 0) {
                        enqueueDirection({ dx: 0, dy: 1 });
                    } else {
                        enqueueDirection({ dx: 0, dy: -1 });
                    }
                }
            }
        }
    }
}

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

window.addEventListener("gamepadconnected", (e) => {
    console.log("Gamepad connected:", e.gamepad);
    gamepadIndex = e.gamepad.index;
    controllerActive = true;
});

window.addEventListener("gamepaddisconnected", (e) => {
    console.log("Gamepad disconnected:", e.gamepad);
    gamepadIndex = null;
    controllerActive = false;
});

function gameLoop() {
    if (controllerActive) {
        updateGamepad();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
