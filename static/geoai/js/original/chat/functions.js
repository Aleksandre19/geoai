import { ModuleLoader } from './utilities';

let loader = new ModuleLoader([
    { module: 'mixins', func: 'Target' },
    { module: 'functions', func: 'ActionBtnFunc'},
]);


// Functions used acrose the application.
export class ActBtn {
    static hide(e) { 
        const elm = e.target;
        elm.classList.remove('display-act-btn-confirm');
        elm.querySelector('.confirm-msg').contentEditable = false;
    }
};


// Define actions (edit, delete) to topic titles. 
export class TitleAction {
    static define(e) {
        e.preventDefault();
        try {
            new ActionBtn(e);
        } catch (error) { 
            throw new Error(error.message);
        }
    }
}

// This is a class for handling actions such as: delete, edit of
// the titles in the chat sidebar.
export class ActionBtnFunc {
    constructor(elm) {
        this.elm = elm;
    }

    get delete() {
        this.elm.setContent(this.elm.nextSibling, '.confirm-msg', 'წავშალო?'); // Confirmation text.
        this.elm.parent.classList.add('hide-element'); // Hide the class='topic-title-act-btn'
        this.elm.nextSibling.classList.add('display-act-btn-confirm'); // Display confirmation container
    }

    get close() {
        this.elm.parent.classList.remove('display-act-btn-confirm'); // ---> class='act-btn-confirm'
        this.elm.prevSibling.classList.remove('hide-element');
    }

    get edit() {
        const actMsg = this.elm.nextSibling.querySelector(`p.confirm-msg`);
        this.elm.nextSibling.classList.add('display-act-btn-confirm'); // Display action buttons.
        actMsg.textContent = this.elm.topicTitle.textContent.trim(); // Add confirmation message.
        actMsg.contentEditable = true; // class='confirm-msg'
        actMsg.focus(); // class='confirm-msg'
    }
}

export class ActionBtn {
    constructor(e) {
        this.e = e;
        this.init();
        this.prevAction;
    }

    async init() {
        try {
            const mixins = await loader.load(['Target', 'ActionBtnFunc']);
            this.elm = new mixins.Target(this.e);
            this.curClasse = this.elm.curClasse(1);
            this.action = new mixins.ActionBtnFunc(this.elm);
            
            this.handleAction();
        } catch (error) {
            throw new Error(`Something went wrong. ${error.message}`);
        }
    }

    handleAction() {
        switch (this.curClasse) {
            case 'geoai-trash-icon':
                this.prevAction = 'delete'
                this.action.delete;
                break;
            case 'geoai-x-icon':
                this.action.close;
                break;
            case 'geoai-edit-icon':
                this.prevAction = 'edit'
                this.action.edit;
                break;
            default:
                this.action.close;
                break;
        }
    }
}


