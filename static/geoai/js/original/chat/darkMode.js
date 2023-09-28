import { ModuleLoader } from './utilities.js'; // Modules loader.

// Cache loaded modules.
let cachedModules = null;

// Modules to be loaded on event.
let loader = new ModuleLoader([
    { module: 'mixins', func: 'Url' },
    { module: 'apiClient', func: 'APIClient' },
]);

export class DarkMode{
    // This class is used to toggle dark/light mode.
    // It grabs current mode from a script element with id 'currentMode',
    // sets a dark/light mode style, removes default mode style,
    // creates new style element, toggles mode button
    // and updates a script element with current mode.
    // If event is passed to constructor, it loads modules,
    // sets up API and updates DB.
    constructor(event = null) {
        this.event = event; // Event.
        this.lightMode = this.getCurMode; // Get current mode.
        this.processMode(); // Process mode.
    }

    // Get current mode.
    get getCurMode() { 
        return JSON.parse(document.getElementById('currentMode').textContent);
    }

    // Process mode.
    async processMode() {
        this.setDarkModeStyle; // Set dark mode style.
        this.removeModeStyleLink; // Remove default mode style.
        this.createNewStyleElm; // Create new style element.
        this.toggleModeBtn; // Toggle mode button.
        this.updateModeScript; // Update a script content with current mode.

        if (this.event) {
            this.module = await this.loadModules();
            await this.setUpApi();
            await this.updateDB();
        }
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
        this.modeStyleLink = '/static/geoai/css/pygments_styles/monokai.css';
        if (this.lightMode) this.modeStyleLink = '/static/geoai/css/pygments_styles/sas.css';

        // Create new style element.
        const newStyleElm = document.createElement('link');
        newStyleElm.rel = 'stylesheet';
        newStyleElm.id = 'pygmentsStyle';
        newStyleElm.href = this.modeStyleLink;

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

     // Load modules.
    async loadModules() {
        
        // Check if modules are already loaded and if so return cache.
        if (cachedModules)
            return cachedModules;
    
        try {
            const modules = await loader.load( // Load modules.
                ['Url', 'APIClient']);
            
            cachedModules = modules // Cache loaded modules.
            return modules
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Set up API.
    async setUpApi() { 
        this.apiUrl = this.module.Url.setup('http://', '/api/', ''); // URL for API.
        this.api = new this.module.APIClient(this.apiUrl); // API client.
    }

    // Update DB.
    async updateDB() { 
        try {
            const userID = document.getElementById('userID').textContent; // User ID.
            const endPoint = `user_settings/${userID}/`; // End point.

            // Data for API.
            const apiData = { 
                'user': `${this.apiUrl}users/${userID}`, // User.
                'light_mode': this.lightMode, // Light mode.
                'mode_style': this.modeStyleLink // Style url.
            };      

            // Call API udpate method.
            await this.api.update(endPoint, apiData);
        } catch (error) { 
            console.log(error.message);
        }
    }
}