let gamepadIndex = null;
let controllerActive = false;
// This helps to keep track of the start button state:
let startButtonWasPressed = false;

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
            // Edge detection for the start button, startButtonWasPressed updates to false when the button is released
            let startButtonPressed = gamepad.buttons[9].pressed;
            if (startButtonPressed && !startButtonWasPressed) {
                togglePause();
                startButtonWasPressed = true;
            } else if (!startButtonPressed) {
                startButtonWasPressed = false;
            }

            if (dPadUp) {
                enqueueDirection({ dx: 0, dy: -1 });
            } else if (dPadDown) {
                enqueueDirection({ dx: 0, dy: 1 });
            } else if (dPadLeft) {
                enqueueDirection({ dx: -1, dy: 0 });
            } else if (dPadRight) {
                enqueueDirection({ dx: 1, dy: 0 });
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
