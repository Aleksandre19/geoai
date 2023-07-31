import { Prevent } from './mixins';
import { titleAct, titleCont } from './titleActionBtn';


// Functions used acrose the application.
export class leaveActBtn {
    static hide(titleWrapper) {
        titleWrapper.removeEventListener('click', Prevent.click);
        const wrapperID = titleWrapper.id.split('-')['1']; // <li id='li-{{topic.id}}'>
        const titleElm = document.getElementById(`title-${wrapperID}`);
        const titleSpan = titleElm.querySelector(`span.title-span`) // <a href="{% url 'topic' topic.slug %}"...
        const titleContent = titleSpan.textContent;
        const titleElipsis = titleElm.querySelector(`span.title-ellipsis`); 
        titleSpan.style.cursor = 'pointer';
        titleSpan.contentEditable = 'false';
        titleSpan.removeEventListener('click', Prevent.click);

        // If `deletion` was triggerd by clickin on trash icon, 
        // and then leaving current title without confirming it
        // the title content will be restored on the `mouseleace` event.
        const curActions = ['delete']; // Click on trash icon.
        if (curActions.includes(titleAct.get))
            titleSpan.textContent = titleCont.get;
            titleAct.clear;
        
        const actBtnElm = titleWrapper.querySelector('.act-btn-confirm');
        const linkElm = titleWrapper.querySelector('.title-link');
        actBtnElm.classList.remove('display-act-btn-confirm')
        linkElm.blur();
    }
};


// This class runes the function from the array.
// export class Func {
//     static async execute(funcs, curClasse) {
//         funcs.forEach(async (actions) => {
//             if (!actions[curClasse]) return;

//             for (const action of actions[curClasse]) {
//                 console.log(action);
//                 await action();
//             }
//         });
//     }
// } 

// This class runs the function from the array.
export class Func {
    static async execute(funcs, curClasse) {
        for (const actions of funcs) {
            if (!actions[curClasse]) continue;

            for (const action of actions[curClasse]) {
                await action();
            }
        }
    }
}
