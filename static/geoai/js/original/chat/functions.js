// import { Target } from './mixins';
import { ModuleLoader } from './utilities';
import { State, Element } from './mixins';

let loader = new ModuleLoader([
    { module: 'mixins', func: 'Target' },
    { module: 'apiClient', func: 'APIClient' },
    { module: 'utilities', func: 'Slugify'},
]);


// Functions used acrose the application.
export class leaveActBtn {
    static hide(titleWrapper) {
        const actBtnElm = titleWrapper.querySelector('.act-btn-confirm');
        const linkElm = titleWrapper.querySelector('.title-link');
        actBtnElm.classList.remove('display-act-btn-confirm');
        linkElm.blur();
    }
};

// This class runes the function from the array.
class Func {
    static execute(funcs, curClasse) {
        funcs.forEach((actions) => {
            if (!actions[curClasse]) return;

            for (const action of actions[curClasse])
                action();
        });
    }
} 


const state = new State();

// Define actions (edit, delete) to topic titles. 
export class TitleAction {
    static define(e) {
        e.preventDefault();
        try {
            new ActionBtn(e, state);
        } catch (error) { 
            throw new Error(error.message);
        }
    }
}


export class ActionBtn {
    constructor(e, state) {     
        this.e = e;
        this.init();
        this.state = state;
    }

    async init() {
        try {
            this.mixins = await loader.load(['Target', 'APIClient', 'Slugify']);
            this.elm = new this.mixins.Target(this.e);
            this.action = new ActionBtnFunc(this.elm, this.state);
            this.curClasse = this.elm.curClasse(1);
            
            this.handleAction();
        } catch (error) {
            throw new Error(`Something went wrong. ${error.message}`);
        }
    }

    confirm() {
        const states = ['edit', 'delete'];
        if (!states.includes(this.state.get))
            return;
        
        const btnProcess = new BtnProcess(this.e, this.mixins);
        // Enhanced version.
        const exacute = [
            {'edit': [() => btnProcess.edition()]},
            {'delete': [() => btnProcess.deletion()]},
        ];
        Func.execute(exacute, this.state.get);
    }

    handleAction() {
        const exacute = [
            {'geoai-check-icon': [() => this.confirm()]},
            {'geoai-trash-icon': [() => this.action.delete, () => this.state.store('delete')]},
            {'geoai-x-icon': [() => this.action.close]},
            {'geoai-edit-icon': [() => this.action.edit, () => this.state.store('edit')]}
        ];

        Func.execute(exacute, this.curClasse);
    }
}


class BtnProcess {
    constructor(e, mixins) {
        this.e = e;
        this.id = mixins.Target.id(this.e);
        console.log(this.id);
        this.titleBlock = document.getElementById(`li-${this.id}`);
        this.curTitle = this.e.target
            .parentNode.parentNode        
            .previousElementSibling

        this.url = 'http://' + window.location.host + '/api/';
        this.endPoint = `topics/${this.id}/`;

        this.api = new mixins.APIClient(this.url);
        this.slug = mixins.Slugify.result(this.updatedTitle);
        this.userID = document.getElementById('userID').textContent;
        
    }

    get updatedTitle() {
        return this.e.target.previousElementSibling
        .textContent.trim().substring(0, 20) + '...';
    }

    get data() {
        return {
            "user": `${this.url}users/${this.userID}`,
            "title": this.updatedTitle,
            "slug": this.slug
        };
    }

    get updateTitleContent() {
        this.curTitle.textContent = this.updatedTitle;
    }

    get removeBlock() {
        this.titleBlock.remove();
    }

    async deletion() {
        await this.api.delete(this.endPoint);
        this.removeBlock;
    }

    async edition() {     
        await this.api.update(this.endPoint, this.data);
        this.updateTitleContent;
    }   
}


const state01 = new State();
// This is a class for handling actions such as: delete, edit of
// the titles in the chat sidebar.
class ActionBtnFunc {
    constructor(e) {
        this.elm = e;
        this.state = state01;
        this.id = e.target.id;
        this.titleElm = document.getElementById(`title-${this.id}`);
        this.titleElm.contentEditable = 'false';
    }

    get delete() {
        this.state.store(this.titleElm.textContent.trim());
        console.log('titleElm', this.titleElm);
        this.titleElm.style.backgroundColor = '#e6e6e6';
        this.titleElm.textContent = 'წავშალო?'
        this.titleElm.focus();
        // this.elm.setContent(this.elm.nextSibling, '.confirm-msg', 'წავშალო?'); // Confirmation text.
        // this.elm.setContent(this.titleElm, `title-${this.id}`, 'წავშალო?'); // Confirmation text.
        this.elm.parent.classList.add('hide-element'); // Hide the class='topic-title-act-btn'
        this.elm.nextSibling.classList.add('display-act-btn-confirm'); // Display confirmation container
    }

    get close() {
        this.elm.parent.classList.remove('display-act-btn-confirm'); // ---> class='act-btn-confirm'
        this.elm.prevSibling.classList.remove('hide-element');
        console.log('close', this.state.get);
        this.titleElm.textContent = this.state.get;
    }

    get edit() {
        this.titleElm.contentEditable = 'true';
        this.titleElm.focus();
        //const actMsg = this.elm.nextSibling.querySelector(`p.confirm-msg`);
        this.elm.nextSibling.classList.add('display-act-btn-confirm'); // Display action buttons.
        // actMsg.textContent = this.elm.topicTitle.textContent.trim(); // Add confirmation message.
        // actMsg.contentEditable = true; // class='confirm-msg'
        // actMsg.focus(); // class='confirm-msg'
    }
}

// function testFunc(e) {
//     const elm = document.querySelector('.act-btn-confirm');
//     elm.removeEventListener('mouseleave');
// }

// Element.setup('.confirm-msg', 'focus', testFunc);








