export class DarkMode{
    // This class is used to toggle dark/light mode.
    // It grabs current mode from a script element with id 'currentMode',
    // sets a dark/light mode style, removes default mode style, 
    // creates new style element, toggles mode button
    // and updates a script element with current mode.
    constructor() {
        // Get current mode.
        this.lightMode = this.getCurMode;
        // Process mode.
        this.processMode;
    }

    // Get current mode.
    get getCurMode() { 
        return JSON.parse(document.getElementById('currentMode').textContent);
    }

    // Process mode.
    get processMode() {
        this.setDarkModeStyle; // Set dark mode style.
        this.removeModeStyleLink; // Remove default mode style.
        this.createNewStyleElm; // Create new style element.
        this.toggleModeBtn; // Toggle mode button.
        this.updateModeScript; // Update a script content with current mode.
    }

    // Set dark/light mode style.
    get setDarkModeStyle() { 
        if (!this.lightMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    // Remove default dark mode style.
    get removeModeStyleLink() { 
        const styleElm = document.getElementById('pygmentsStyle');
        if (styleElm) styleElm.remove();            
    }

    // Create new style element.
    get createNewStyleElm() { 
        // Set mode style link.
        let modeStyleLink = '/static/geoai/css/pygments_styles/monokai.css';
        if (this.lightMode) modeStyleLink = '/static/geoai/css/pygments_styles/sas.css';

        // Create new style element.
        const newStyleElm = document.createElement('link');
        newStyleElm.rel = 'stylesheet';
        newStyleElm.id = 'pygmentsStyle';
        newStyleElm.href = modeStyleLink;

        // Append new style element to head.
        document.head.appendChild(newStyleElm);
    }

    // Toggle mode button.
    get toggleModeBtn() {
        const btnElm = document.getElementById('darkmode-toggle');
        btnElm.checked = true;
        if(this.lightMode) btnElm.checked = false;
    }

    // Update a script content with current mode.
    get updateModeScript() { 
        document.getElementById('currentMode').innerHTML = !this.lightMode;
    }
}