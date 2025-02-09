import './node_modules/@simonwep/pickr/dist/themes/classic.min.css';

// Experimental:

// Create a Pickr instance
const pickr = Pickr.create({
    el: '.color-picker',
    theme: 'classic', // or 'monolith', 'nano'
    default: '#008000',
    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
            hex: true,
            rgba: true,
            input: true,
            save: true
        }
    }
});

// // Center the color picker dialog when it opens
pickr.on('show', () => {
    const pickerRoot = document.querySelector('.pcr-app'); // Get the picker element
    pickerRoot.style.position = 'absolute';
    pickerRoot.style.top = '50%';
    pickerRoot.style.left = '50%';
    pickerRoot.style.transform = 'translate(-50%, -50%)'; // Center it
});
