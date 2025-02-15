// Settings menu handling:

const backdrop = document.getElementById('backdrop');

function toggleSettingsMenu() {
    backdrop.classList.remove('hidden');
    // MoveInterval to zero!
    const settingMenu = document.getElementById('settingsmenu');
    settingMenu.style.display = (settingMenu.style.display === 'none') ? 'block' : 'none';

    backdrop.addEventListener('click', function(event) {
        if (event.target === backdrop) {
            if (settingMenu.style.display !== 'none') {
                backdrop.classList.add('hidden');
                settingMenu.style.display = 'none';
                if(!gameOverFlag) {
                togglePause();
                }
            }
        }
    });
}

function applySettings() {
    const settingMenu = document.getElementById('settingsmenu');
    backdrop.classList.add('hidden');
    settingMenu.style.display = 'none';
    if(!gameOverFlag && !paused) {
        togglePause();
    }
}

// Volume handling:

const soundtrackVolumeSlider = document.getElementById('soundtrackVolume');
const eatSoundVolumeSlider = document.getElementById('eatSoundVolume');

if (localStorage.getItem('soundtrackVolume')) {
    soundtrackVolumeSlider.value = parseFloat(localStorage.getItem('soundtrackVolume'));
    soundtrack.volume = parseFloat(localStorage.getItem('soundtrackVolume'));
} else {
    soundtrackVolumeSlider.value = 0.15;
    soundtrack.volume = 0.15;
}

if (localStorage.getItem('eatSoundVolume')) {
    eatSoundVolumeSlider.value = parseFloat(localStorage.getItem('eatSoundVolume'));
    eatSound.volume = parseFloat(localStorage.getItem('eatSoundVolume'));
} else {
    eatSoundVolumeSlider.value = 0.2;
    eatSound.volume = 0.2;
}

soundtrackVolumeSlider.addEventListener('input', () => {
    const volume = soundtrackVolumeSlider.value;
    soundtrack.volume = volume;
    localStorage.setItem('soundtrackVolume', volume);
});

eatSoundVolumeSlider.addEventListener('input', () => {
    const volume = eatSoundVolumeSlider.value;
    eatSound.volume = volume;
    localStorage.setItem('eatSoundVolume', volume);
});

function resetSettings() {
    const settingMenu = document.getElementById('settingsmenu');
    const trembleToggle = document.getElementById('trembleToggle');
    trembleToggle.checked = false;
    soundtrackVolumeSlider.value = 0.15;
    eatSoundVolumeSlider.value = 0.2;
    soundtrack.volume = 0.15;
    eatSound.volume = 0.2;
    localStorage.setItem('soundtrackVolume', 0.15);
    localStorage.setItem('eatSoundVolume', 0.2);
    localStorage.removeItem('snakeColor');
    backdrop.classList.add('hidden');
    settingMenu.style.display = 'none';
    if (!gameOverFlag && !paused) {
    togglePause();
    }
}

// Go home / refresh

function goHome() {
    window.location.reload();
}

// Snake color
const snakeColorPicker = document.getElementById('snakeColorPicker');
let snakeColor = localStorage.getItem('snakeColor') || snakeColorPicker.value;
snakeColorPicker.addEventListener('input', () => {
    snakeColor = snakeColorPicker.value;
    localStorage.setItem('snakeColor', snakeColor);
});

// Settings menu flip
function flipPage() {
    const settingsMenu1 = document.getElementById('settingsmenu');
    const settingsMenu2 = document.getElementById('settingsmenu2');
    settingsMenu1.style.display = (settingsMenu1.style.display === 'none') ? 'block' : 'none';
    settingsMenu2.style.display = (settingsMenu2.style.display === 'none') ? 'block' : 'none';
}

// Grid size switch

document.querySelectorAll('.switchlabel').forEach(label => {
    label.addEventListener('click', function() {
        // Remove active class from all labels
        document.querySelectorAll('.switchlabel').forEach(l => l.classList.remove('active'));
        // Add active class to clicked label
        this.classList.add('active');
    });
});

// Eyes

let eyesRemoved = false;
const removeEyes = document.getElementById('removeEyes');

if (localStorage.getItem('removeEyes') === 'true') {
    removeEyes.checked = true;
    eyesRemoved = true;
} else {
    removeEyes.checked = false;
    eyesRemoved = false;
}

removeEyes.addEventListener('change', () => {
    eyesRemoved = removeEyes.checked;
    localStorage.setItem('removeEyes', eyesRemoved);
});

let fpsShown = false;
const fpsdiv = document.getElementById('fps');
const showFPS = document.getElementById('fps2');

if (localStorage.getItem('fps') === 'true') {
    showFPS.checked = true;
    fpsShown = true;
    fpsdiv.style.display = 'flex';
} else {
    showFPS.checked = false;
    fpsShown = false;
    fpsdiv.style.display = 'none';
}

showFPS.addEventListener('change', () => {
    fpsShown = showFPS.checked;
    localStorage.setItem('fps', fpsShown);
    if (fpsShown) {
        fpsdiv.style.display = 'flex';
    } else {
        fpsdiv.style.display = 'none';
    }
})