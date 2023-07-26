import { ModuleLoader } from './utilities';
import { Store, Prevent} from './mixins';
export const titleAct = new Store(); // Title action storage.
export const titleCont = new Store(); // Title content storage.


// Map functions to their moduls. 
let loader = new ModuleLoader([
    { module: 'mixins', func: 'Target' },
    { module: 'mixins', func: 'Url' },
    { module: 'apiClient', func: 'APIClient' },
    { module: 'utilities', func: 'Slugify' },
    { module: 'functions', func: 'Func'},
]);


// Define actions (edit, delete) to topic titles. 
export class TitleActionBtn {
    static define(e) {
        e.preventDefault();
        try {
            new BtnSteup(e, titleAct);
        } catch (error) { 
            throw new Error(error.message);
        }
    }
}


class BtnSteup {
    constructor(e, titleAct) {     
        this.e = e; // Current button action event.
        this.init();
        this.titleAct = titleAct; // The action storage.
    }

    async init() {
        try {
            // Load necessary functions on event from mixins.js.
            this.mixins = await loader.load([
                'Target', 'APIClient', 'Slugify', 'Func', 'Url']);

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
            this.action = new BtnFrontEndFunc(this.elm);

            // Button action methods.
            this.handleAction();

        } catch (error) {
            throw new Error(`Something went wrong. ${error.message}`);
        }
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
        this.mixins.Func.execute(exacute, this.curClasse);
    }

    confirm() {
        // Check if the action is allowed.
        const allowedActs = ['edit', 'delete'];
        if (!allowedActs.includes(this.titleAct.get))
            return;
        
        // Method which prepares everything before sending request to the API client.
        const PrepRequest = new PrepareRequest(this.e, this.mixins);

        const exacute = [ // Map the action types to their corresponding methods.
            {'edit': [() => PrepRequest.edition()]},
            {'delete': [() => PrepRequest.deletion()]},
        ];

        // Function executor.
        this.mixins.Func.execute(exacute, this.titleAct.get);
    }
}

// Prepare everything and call to the API client methods.
class PrepareRequest {
    constructor(e, mixins) {
        this.e = e; // class='geoai-check-icon'
        this.mixins = mixins;
        this.id = this.mixins.Target.id(this.e);
        this.titleBlock = document.getElementById(`li-${this.id}`); // <li id='li-{{topic.id}}'>   
        this.curTitle = document.getElementById(`title-${this.id}`);// Title `a` element.
        this.endPoint = `topics/${this.id}/`;
        this.url = this.mixins.Url.setup('http://','/api/', '');      
        this.api = new this.mixins.APIClient(this.url); // API Client.
        this.slug = this.mixins.Slugify.result(this.trimTitle);
        this.userID = document.getElementById('userID').textContent; // Current user ID.     
    }

    // Trim title content.
    get trimTitle() {
        return this.curTitle.textContent.trim().substring(0, 15);
    }

    // Set up a data for the `fetch` method of the APIClient.
    get data() {
        return {
            "user": `${this.url}users/${this.userID}`,
            "title": this.trimTitle,
            "slug": this.slug
        };
    }

    // Update urls.
    updateUrl(action) {
        const allowedActions = ['edit', 'delete'];
        if (!allowedActions.includes(action)) return;

        const curPage = document.getElementById('currentPage').textContent; // Current page.
        const origSlug = this.mixins.Slugify.result(titleCont.get); // Original slug


        let newUrl, txtContent;
        if (action === 'delete') {
            newUrl = this.mixins.Url.setup('http://', '/chat/', '');
            txtContent = 'chat'
        } else if (action === 'edit') {
            newUrl = this.mixins.Url.setup('http://', '/chat/', `${this.slug}/`);
            txtContent = this.slug;
        }

        const pages = ['chat']; // Page.

        // Check if current page is not home.
        if (!pages.includes(curPage)) {
            // Update only the current topic URL in the browser address bar.
            if(curPage === origSlug)
                window.history.pushState({}, '', newUrl); 
            
            this.curTitle.setAttribute('href', newUrl);

            // Update the current page in the chat/index.html.
            document.getElementById('currentPage').textContent = txtContent;
            return;
        }

        // If current page is home.
        if (pages.includes(curPage)) {
            // Update a `href` attribute of the topic title.
            this.curTitle.setAttribute('href', newUrl);
        }
    }

    // Update title after succesfully response from the server.
    get updateTitle() {
        // If titles length is more than 15, add ellipsis.
        const addEllipsis = this.trimTitle.length < 15
            ? this.trimTitle : this.trimTitle + '...';
        
        // Set updated content to title.
        this.curTitle.textContent = addEllipsis;

        // Add a mouse ponter back.
        this.curTitle.style.cursor = 'pointer';

        // Toggling styles of action btn and confirm btn blocks.
        this.e.target.parentNode.classList
            .remove('display-act-btn-confirm'); // ---> class='act-btn-confirm'
        this.e.target.parentNode.previousElementSibling
            .classList.remove('hide-element'); // class='topic-title-act-btn'
    }

    // Remove title from the side bar when is has been deleted in server.
    get removeBlock() {
        this.titleBlock.remove();
    }

    // Call API's deletetion.
    async deletion() {
        await this.api.delete(this.endPoint);
        this.removeBlock;
        this.updateUrl('delete');
    }

    // Call API's edition.
    async edition() {
        await this.api.update(this.endPoint, this.data);
        this.updateTitle;
        this.updateUrl('edit');
    }   
}


// Set up front-end functionalities for action buttons such as: `Edit`, `Delete`, and `Close`.
class BtnFrontEndFunc {
    constructor(e) {
        this.elm = e; // current: edit, check, trash or close icon.
        this.titleCont = titleCont; // Storage for title content.
        this.id = e.target.id;
        this.curLi = document.getElementById(`li-${this.id}`); // Title parent `<li>` element.
        this.titleElm = document.getElementById(`title-${this.id}`); //  <a href="{% url 'topic' topic.slug %}"...
        this.titleElm.contentEditable = 'false';
    }

    // Front-end of deletion.
    get delete() {
        this.curLi.addEventListener('click', Prevent.click);
        this.titleCont.store(this.titleElm.textContent.trim());
        this.titleElm.textContent = 'წავშალო?'; // Confirmation text.
        this.titleElm.focus();
        this.titleElm.style.cursor = 'default';
        this.elm.parent.classList.add('hide-element'); // Hide the class='topic-title-act-btn'
        this.elm.nextSibling.classList.add('display-act-btn-confirm'); // Display confirmation container
    }

    // Front-end of closing.
    get close() {
        this.curLi.removeEventListener('click', Prevent.click);
        this.titleElm.style.cursor = 'pointer';
        this.elm.parent.classList.remove('display-act-btn-confirm'); // ---> class='act-btn-confirm'
        this.elm.prevSibling.classList.remove('hide-element'); // class='topic-title-act-btn'
        this.titleElm.textContent = this.titleCont.get; // Update with the title content.
    }

    // Front-end of edition.
    get edit() {
        this.titleElm.contentEditable = 'true';
        this.titleElm.style.cursor = 'text';
        this.titleElm.focus();
        this.titleCont.store(this.titleElm.textContent.trim()); // Store title content.
        this.elm.nextSibling.classList.add('display-act-btn-confirm'); // Display action buttons.
    }

}