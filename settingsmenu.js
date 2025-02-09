// Settings menu handling:

const backdrop = document.getElementById('backdrop');

function toggleSettingsMenu() {
    backdrop.classList.remove('hidden');
    // MoveInterval to zero!
    clearInterval(moveInterval);
    const settingMenu = document.getElementById('settingsmenu');
    settingMenu.style.display = (settingMenu.style.display === 'none') ? 'block' : 'none';

    backdrop.addEventListener('click', function(event) {
        if (event.target === backdrop) {
            if (settingMenu.style.display !== 'none') {
                backdrop.classList.add('hidden');
                settingMenu.style.display = 'none';
                moveInterval = setInterval(moveSnake, 200);
                }
            }
        });
}

function applySettings() {
    const settingMenu = document.getElementById('settingsmenu');
    backdrop.classList.add('hidden');
    settingMenu.style.display = 'none';
    moveInterval = setInterval(moveSnake, 200);
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
    soundtrackVolumeSlider.value = 0.15;
    eatSoundVolumeSlider.value = 0.2;
    soundtrack.volume = 0.15;
    eatSound.volume = 0.2;
    localStorage.setItem('soundtrackVolume', 0.15);
    localStorage.setItem('eatSoundVolume', 0.2);
    localStorage.removeItem('snakeColor');
    backdrop.classList.add('hidden');
    settingMenu.style.display = 'none';
    moveInterval = setInterval(moveSnake, 200);

}

// Go home / refresh

function goHome() {
    window.location.reload();
}

// Snake color handling:

const snakeColorPicker = document.getElementById('snakeColorPicker');

let snakeColor = localStorage.getItem('snakeColor') || snakeColorPicker.value;

snakeColorPicker.addEventListener('input', () => {
    snakeColor = snakeColorPicker.value;
    localStorage.setItem('snakeColor', snakeColor);
});