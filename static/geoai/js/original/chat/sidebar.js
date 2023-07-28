import { SetEvent, GrabElements } from './mixins';
import { leaveActBtn} from './functions';
import { TitleActionBtn } from './titleActionBtn';
import { TitleProperties } from './titleActionBtn';

export class Sidebar {
    static get setup() { 
        let actionWrapper = GrabElements.for('.act-wrapper');
        actionWrapper.forEach(element => {
            const titleLi = element.parentNode; // <li id='li-{{topic.id}}'>
            SetEvent.to([titleLi], 'mouseleave', () => leaveActBtn.hide(titleLi));
            // SetEvent.to([element], 'click', TitleActionBtn.define);
            SetEvent.to([element], 'click', (e) => new TitleProperties(e));
        });
    }
}
