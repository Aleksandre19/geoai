import { Prevent } from './mixins';
import { titleAct, titleCont } from './titleActionBtn';


// Functions used acrose the application.
export class leaveActBtn {
    static hide(titleWrapper) {
        titleWrapper.removeEventListener('click', Prevent.click);
        const wrapperID = titleWrapper.id.split('-')['1']; // <li id='li-{{topic.id}}'>
        const titleElm = document.getElementById(`title-${wrapperID}`) // <a href="{% url 'topic' topic.slug %}"...
        titleElm.style.cursor = 'pointer';
        titleElm.contentEditable = 'false';

        // If `deletion` was triggerd by clickin on trash icon, 
        // and then leaving current title without confirming it
        // the title content will be restored on the `mouseleace` event.
        const curActions = ['delete']; // Click on trash icon.
        if (curActions.includes(titleAct.get))
            titleElm.textContent = titleCont.get;
            titleAct.clear;
        
        const actBtnElm = titleWrapper.querySelector('.act-btn-confirm');
        const linkElm = titleWrapper.querySelector('.title-link');
        actBtnElm.classList.remove('display-act-btn-confirm')
        linkElm.blur();
    }
};


// This class runes the function from the array.
export class Func {
    static execute(funcs, curClasse) {
        funcs.forEach((actions) => {
            if (!actions[curClasse]) return;

            for (const action of actions[curClasse])
                action();
        });
    }
} 
