import { ModuleLoader } from './utilities';
import { Store, Prevent} from './mixins';
const titleAct = new Store();
const titleCont = new Store();

let loader = new ModuleLoader([
    { module: 'mixins', func: 'Target' },
    { module: 'apiClient', func: 'APIClient' },
    { module: 'utilities', func: 'Slugify'},
]);


// Functions used acrose the application.
export class leaveActBtn {
    static hide(titleWrapper) {
        titleWrapper.removeEventListener('click', Prevent.click);
        const wrapperID = titleWrapper.id.split('-')['1']; // <li id='li-{{topic.id}}'>
        const titleElm = document.getElementById(`title-${wrapperID}`) // <a href="{% url 'topic' topic.slug %}"...
        titleElm.style.cursor = 'pointer';
        // Replace confirmation message with original title's content if delete was triggered before.
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
class Func {
    static execute(funcs, curClasse) {
        funcs.forEach((actions) => {
            if (!actions[curClasse]) return;

            for (const action of actions[curClasse])
                action();
        });
    }
} 


// Define actions (edit, delete) to topic titles. 
export class TitleAction {
    static define(e) {
        e.preventDefault();
        try {
            new ActionBtn(e, titleAct);
        } catch (error) { 
            throw new Error(error.message);
        }
    }
}


export class ActionBtn {
    constructor(e, titleAct) {     
        this.e = e; // Current button action event.
        this.init();
        this.titleAct = titleAct; // The action storage.
    }

    async init() {
        try {
            // Load necessary functions on event from mixins.js.
            this.mixins = await loader.load(['Target', 'APIClient', 'Slugify']);

            // Set up the required data.
            this.elm = new this.mixins.Target(this.e); // Get element for the current event.
            this.curClasse = this.elm.curClasse(1); // Get element's class attribute.
 
            // Determine the classes from where a request is accepted.
            const allowedClasses = [
                'geoai-check-icon', 'geoai-trash-icon',
                'geoai-x-icon', 'geoai-edit-icon'
            ]

            // Check if the request is allowed.
            if (!allowedClasses.includes(this.curClasse))
                return;
            
            // Front-end functionalitties for action buttons such as: `Edit`, `Delete`, `Close`.
            this.action = new ActionBtnFunc(this.elm);

            // Button action methods.
            this.handleAction();

        } catch (error) {
            throw new Error(`Something went wrong. ${error.message}`);
        }
    }

    confirm() {
        // Check if the action is allowed.
        const allowedActs = ['edit', 'delete'];
        if (!allowedActs.includes(this.titleAct.get))
            return;
        
        // Method which prepares everything before sending request to the API client.
        const btnProcess = new BtnProcess(this.e, this.mixins);

        const exacute = [ // Map the action types to their corresponding methods.
            {'edit': [() => btnProcess.edition()]},
            {'delete': [() => btnProcess.deletion()]},
        ];

        // Function executor.
        Func.execute(exacute, this.titleAct.get);
    }

    // Prepare and execute button action methods.
    handleAction() {
        // Map the elements to their corresponding methods by class attribute.
        const exacute = [ 
            {'geoai-check-icon': [() => this.confirm()]}, // Confirm.
            {'geoai-trash-icon': [() => this.action.delete, () => this.titleAct.store('delete')]}, // Delete.
            {'geoai-x-icon': [() => this.action.close]}, // Close.
            {'geoai-edit-icon': [() => this.action.edit, () => this.titleAct.store('edit')]} // Edit.
        ];

        // Function executor.
        Func.execute(exacute, this.curClasse);
    }
}

// Prepare everything before sending a request to the API client.
class BtnProcess {
    constructor(e, mixins) {
        this.e = e; // class='geoai-check-icon'
        this.id = mixins.Target.id(this.e);
        this.titleBlock = document.getElementById(`li-${this.id}`);
        this.curTitle = document.getElementById(`title-${this.id}`);
        this.url = 'http://' + window.location.host + '/api/';
        this.endPoint = `topics/${this.id}/`;
        this.api = new mixins.APIClient(this.url); // API Client.
        this.slug = mixins.Slugify.result(this.updatedTitle);
        this.userID = document.getElementById('userID').textContent;      
    }

    get updatedTitle() {
        return this.curTitle.textContent.trim().substring(0, 15);
    }

    get data() {
        return {
            "user": `${this.url}users/${this.userID}`,
            "title": this.updatedTitle,
            "slug": this.slug
        };
    }

    get updateTitle() {
        const addEllipsis = this.updatedTitle.length < 15
            ? this.updatedTitle : this.updatedTitle + '...';
        this.curTitle.textContent = addEllipsis;

        // Toggling styles of action btn and confirm btn blocks.
        this.e.target.parentNode.classList
            .remove('display-act-btn-confirm'); // ---> class='act-btn-confirm'
        this.e.target.parentNode.previousElementSibling
            .classList.remove('hide-element'); // class='topic-title-act-btn'
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
        this.updateTitle;
    }   
}


// Set up front-end functionalities for action buttons such as: `Edit`, `Delete`, and `Close`.
class ActionBtnFunc {
    constructor(e) {
        this.elm = e; // current: edit, check, trash or close icon.
        this.titleCont = titleCont;
        this.id = e.target.id;
        this.curLi = document.getElementById(`li-${this.id}`);
        this.titleElm = document.getElementById(`title-${this.id}`); //  <a href="{% url 'topic' topic.slug %}"...
        this.titleElm.contentEditable = 'false';
    }

    get delete() {
        this.curLi.addEventListener('click', Prevent.click);
        this.titleCont.store(this.titleElm.textContent.trim());
        this.titleElm.textContent = 'წავშალო?';
        this.titleElm.focus();
        this.titleElm.style.cursor = 'default';
        this.elm.parent.classList.add('hide-element'); // Hide the class='topic-title-act-btn'
        this.elm.nextSibling.classList.add('display-act-btn-confirm'); // Display confirmation container
    }

    get close() {
        this.curLi.removeEventListener('click', Prevent.click);
        this.titleElm.style.cursor = 'pointer';
        this.elm.parent.classList.remove('display-act-btn-confirm'); // ---> class='act-btn-confirm'
        this.elm.prevSibling.classList.remove('hide-element'); // class='topic-title-act-btn'
        this.titleElm.textContent = this.titleCont.get;
    }

    get edit() {
        this.titleElm.contentEditable = 'true';
        this.titleElm.focus();
        this.titleCont.store(this.titleElm.textContent.trim());
        this.elm.nextSibling.classList.add('display-act-btn-confirm'); // Display action buttons.
    }

}