import { SetEvent, GrabElements, GrabSingleElement } from './mixins';
import { TitleProperties } from './titleActionBtn';
import { DarkMode } from './darkMode';


export class Sidebar {
    constructor() {
        // Grab elements.
        this.element = document.getElementById('menu-checkbox');
        this.main = document.getElementById('chat-main');
        this.sidebarWrapper = document.getElementById('sidebar-wrapper');

        // Run sidebar functionalities.
        this.runsProcesses;
    }

    get runsProcesses() {
        this.actionButtons; // Edit, Delete, Aprove & cancel on sidemenu.
        this.toggleMode; // Dark/Light mode toggler.
        this.bindHambMenuFunc; // Functions for Hamburger menu events.
        this.setEventsToHambMenu // Set events to hamburger menu.
    }

    get actionButtons() { 
        let actionWrapper = GrabElements.for('.act-wrapper');
        actionWrapper.forEach(element => {
            SetEvent.to([element], 'click', (e) => new TitleProperties(e));
        });
    }

    get toggleMode() {
        const modeBtn = document.getElementById('darkmode-toggle');
        new DarkMode();
        SetEvent.to([modeBtn], 'click', (e) => new DarkMode(e));
    }

    // Bind event functions.
    get bindHambMenuFunc() {
        this.hambClick = this.hambClickEventFunc.bind(this);
        this.hambResize = this.hambWindowResizeFunc.bind(this);
    }

    // Set Events to the lower devices hamburger menu.
    get setEventsToHambMenu() {
        SetEvent.to([this.element], 'click', this.hambClick);
        SetEvent.to([window], 'resize', this.hambResize);
    }

    hambClickEventFunc() {
        if (!this.element.checked) {
            this.main.style.gridTemplateColumns = '1fr';
            this.sidebarWrapper.classList.remove('sidebar-overlay');
            return;
        }
        this.sidebarWrapper.classList.add('sidebar-overlay');
    }

    hambWindowResizeFunc() {
        this.sidebarWrapper.classList.remove('sidebar-overlay');
        if (window.innerWidth > 820){
            this.main.style.gridTemplateColumns = '1fr 4fr';
        } else {
            if (this.element.checked) {
                this.main.style.gridTemplateColumns = '1fr 2fr';
            } else {
                this.sidebarWrapper.classList.remove('sidebar-overlay');
                this.main.style.gridTemplateColumns = '1fr';
            }
        }
    }

}
