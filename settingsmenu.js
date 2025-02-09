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