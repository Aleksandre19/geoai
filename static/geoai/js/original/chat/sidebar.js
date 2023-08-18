import { SetEvent, GrabElements, GrabSingleElement } from './mixins';
import { TitleProperties } from './titleActionBtn';
import { DarkMode } from './darkMode';

export class Sidebar {
    static get actionButtons() { 
        let actionWrapper = GrabElements.for('.act-wrapper');
        actionWrapper.forEach(element => {
            SetEvent.to([element], 'click', (e) => new TitleProperties(e));
        });
    }

    static get toggleMode() {
        const modeBtn = document.getElementById('darkmode-toggle');
        new DarkMode();
        SetEvent.to([modeBtn], 'click', (e) => new DarkMode(e));
    }
}
