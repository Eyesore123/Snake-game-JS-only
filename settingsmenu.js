// Settings menu handling:

const backdrop = document.getElementById('backdrop');

function toggleSettingsMenu() {
    backdrop.classList.remove('hidden');
    const settingMenu = document.getElementById('settingsmenu');
    settingMenu.style.display = (settingMenu.style.display === 'none') ? 'block' : 'none';

    backdrop.addEventListener('click', function(event) {
        if (event.target === backdrop) {
            if (settingMenu.style.display !== 'none') {
                backdrop.classList.add('hidden');
                settingMenu.style.display = 'none';
                }
            }
        });
}

function applySettings() {
    const settingMenu = document.getElementById('settingsmenu');
    backdrop.classList.add('hidden');
    settingMenu.style.display = 'none';
}

// Function to update the volume of the soundtrack

const soundtrackVolumeSlider = document.getElementById('soundtrackVolume');
const eatSoundVolumeSlider = document.getElementById('eatSoundVolume');

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