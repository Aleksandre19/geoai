import { SetEvent, GrabElements } from './mixins';
import { TitleProperties } from './titleActionBtn';

export class Sidebar {
    static get setup() { 
        let actionWrapper = GrabElements.for('.act-wrapper');
        actionWrapper.forEach(element => {
            SetEvent.to([element], 'click', (e) => new TitleProperties(e));
        });
    }
}
