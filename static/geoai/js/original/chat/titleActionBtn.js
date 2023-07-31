import { ModuleLoader } from './utilities';
import { Store, Prevent} from './mixins';
export const titleAct = new Store(); // Title action storage.
export const titleCont = new Store(); // Title content storage.
let cachedModules = null; // Cache loaded modules.


// Map functions to their moduls. 
let loader = new ModuleLoader([
    { module: 'mixins', func: 'Target' },
    { module: 'mixins', func: 'Url' },
    { module: 'mixins', func: 'Ellipsis' },
    { module: 'mixins', func: 'Prevent' },
    { module: 'mixins', func: 'SetEvent' },
    { module: 'apiClient', func: 'APIClient' },
    { module: 'utilities', func: 'Slugify' },
    { module: 'functions', func: 'Func' },
]);


export class TitleProperties {
    constructor(event) {
        event.preventDefault();
        this.event = event; // Current event.
        this.init();
    }


    async init() {     
        if (!this.acctionIsAllowed) return; // STEP 01 (Check if the action is allowed.)
        this.module = await this.loadModules(); // STEP 02 (Load modules.)
        this.defineProperties; // STEP 03 (Define properties.)
        this.editAct = () => this.titleEdition; // STEP 04 (Define title edition action.)
        this.deleteAct = () => this.titleDeletion; // STEP 05 (Define title deletion action.)
        this.cancelAct = () => this.cancelAction; // STEP 06 (Define cancel action.)
        this.executeActionFunction(this.curElmClass); // STEP 07 (Execute `Edit`, `Delete` or `Cancel`.)
        this.onMouseLeave; // STEP 08 (Define mouse leave event.)
        // Followin code runs only when the user clicks (approves) on the check icon.
        if (!this.approvedAct) return; // STEP 08 (Check if the action is approved.)
        this.prepareDataForAPI; // STEP 09 (Prepare data for API.)
        await this.callAPI(); // STEP 10 (This method calls eather `edit` or `delete` action,
                             // based on titleActStore, in which a desiered action is stored
                             // when the user clicks on the `edit` or `delete` icons.)
        this.defineNewUrl; // STEP 11 (Define new url.)
        this.updateAddressBar; // STEP 12 (Update address bar.)
        this.setHrefAttrToTitle; // STEP 13 (Set href attribute to title.)
        this.updateCurrentPage; // STEP 14 (Update current page.)
        this.updateTitleContent; // STEP 15 (Update title content.)
    }

    // Check if the action is allowed class name of the element.
    get acctionIsAllowed() { // STEP 01
        const allowedClasses = [
            'geoai-check-icon', 'geoai-trash-icon', 
            'geoai-x-icon', 'geoai-edit-icon'
        ]

        const classes = this.event.target.className.split(" ");
        const curClass = classes[classes.length - 1];  
        
        if (allowedClasses.includes(curClass)) return true;
    }


    // Load modules.
    async loadModules() { // STEP 02
        
        // Check if modules are already loaded and if so return cache.
        if (cachedModules)
            return cachedModules;
        
        try {
            const modules = await loader.load( // Load modules.
                ['Target', 'APIClient', 'Slugify', 'Func', 'Url', 'Ellipsis', 'Prevent', 'SetEvent']);
            
            cachedModules = modules // Cache loaded modules.
            return modules
        } catch (error) {
            throw new Error(error.message);
        }
    }


    get defineProperties() { // STEP 03
        this.target = new this.module.Target(this.event); // Get element for the current event.
        this.elm = this.target.target; // Get element 'Edit', 'Delete', 'Approve' or 'close' icons.
        this.elmID = this.elm.id; // Get element's id attribute.
        this.curElmClass = this.target.curClasse(1); // Get element's class attribute. 
        this.liElm = document.getElementById(`li-${this.elmID}`); // Get current li element.
        this.actBtnContainer = this.liElm.querySelector('.act-btn-confirm'); // Get current action button container.  
        this.titleElm = document.getElementById(`title-${this.elmID}`); // Get current title `a` element.
        this.titleSpan = document.querySelector(`#title-${this.elmID}  > .title-span`); // Get current title `a` element.
        this.titleContSpan = document.getElementById(`t-span-${this.elmID}`); // Get current title content span element.
        this.ellipsisSpan = new this.module.Ellipsis(this.elmID) // Get current ellipsis span element.
        this.trimedTitle = this.titleContSpan.textContent.trim().substring(0, 15); // Trim tiitle content. 
        this.titleContStore = titleCont; // Get title content storage.
        this.titleActStore = titleAct; // Store current title action.     
        this.apiEndPoint = `topics/${this.elmID}/`; // API end point.
        this.apiUrl = this.module.Url.setup('http://', '/api/', '');
        this.apiClient = new this.module.APIClient(this.apiUrl); // API Client.
        this.apiData = {}; // Data to be sent to the API.
        this.slug = this.module.Slugify.result(this.trimedTitle);
        this.userID = document.getElementById('userID').textContent; // Current user ID.
        this.curPage = document.getElementById('currentPage').textContent; // Current page.
        this.updtCurPage = null; // Updated current page.
        this.newUrl = null; // New url.
        this.homePage = ['chat'];
    }

    // Title edition.
    get titleEdition() { // STEP 04
        this.module.SetEvent.to([this.titleSpan], 'click', this.module.Prevent.click) // Prevent default event.
        this.titleActStore.store('edit');
        this.titleSpan.contentEditable = 'true';
        this.titleSpan.style.cursor = 'text';
        this.titleSpan.focus();
        this.titleContStore.store(this.titleContSpan.textContent.trim()); // Store title content.
        this.target.nextSibling.classList.add('display-act-btn-confirm'); // Display action buttons.
        if (this.titleContStore.get.length >= 15) this.ellipsisSpan.toggle; // Hide ellipsis.
    }

    // Title deletion.
    get titleDeletion() { // STEP 05
        this.titleContStore.store(this.titleContSpan.textContent.trim());
        this.titleActStore.store('delete');
        this.titleContSpan.textContent = 'წავშალო?'; // Confirmation text.
        this.titleElm.focus();
        this.titleElm.style.cursor = 'default';
        //this.target.parent.classList.add('hide-element'); // Hide the class='topic-title-act-btn'
        this.target.nextSibling.classList.add('display-act-btn-confirm'); // Display confirmation container
        if (this.titleContStore.get.length >= 15) this.ellipsisSpan.toggle; // Hide ellipsis.
    }

    // Cancel current action.
    get cancelAction() { // STEP 06
        this.titleSpan.removeEventListener('click', this.module.Prevent.click); // Remove event listener.
        this.titleSpan.style.cursor = 'pointer';
        this.target.parent.classList.remove('display-act-btn-confirm'); // ---> class='act-btn-confirm'
        //this.target.prevSibling.classList.remove('hide-element'); // class='topic-title-act-btn'
        this.titleContSpan.textContent = this.titleContStore.get; // Update with the title content.
        if (this.titleContStore.get.length >= 15) this.ellipsisSpan.toggle; // Hide ellipsis.
        //this.titleActStore.clear;
    }

    // Proccess action button interactive functionalities.
    // Execute corresponding function to the action.
    executeActionFunction(curClass) { // STEP 07
         // Map the elements to their corresponding methods by class attribute.
        const exacute = [ 
            {'geoai-edit-icon': [this.editAct, () => this.titleActStore.get]}, // Edit.
            {'geoai-trash-icon': [this.deleteAct, () => this.titleActStore.get]}, // Delete.
            {'geoai-x-icon': [this.cancelAct]}, // Cancel current action.
            //{'geoai-check-icon': [() => this.confirm()]}, // Confirm.
        ];

        // Function executor.
        this.module.Func.execute(exacute, curClass);
    }

    get onMouseLeave() {
        this.module.SetEvent.to([this.liElm], 'mouseleave', () => {
            
            // Check if the action is allowed.
            const allowedActions = ['edit', 'delete'];
            if (!allowedActions.includes(this.titleActStore.get)) return;

            const curAction = this.titleActStore.get;
            console.log('curAction', curAction);

            if(this.actBtnContainer.classList.contains('display-act-btn-confirm'))
                this.actBtnContainer.classList.remove('display-act-btn-confirm');
            
            if (curAction === 'delete')
                this.titleContSpan.textContent = this.titleContStore.get;
            
            if (curAction === 'edit') {
                this.titleContSpan.textContent = this.titleContStore.get;
                this.titleContSpan.contentEditable = 'false';
                this.titleSpan.style.cursor = 'pointer';
                this.titleContSpan.blur();
            }

            this.titleActStore.clear;
            this.titleContStore.clear;
                
        });  
    }

    // Check if the action is allowed.
    get approvedAct() {  // STEP 08
        const allowedActs = ['geoai-check-icon'];
        if (allowedActs.includes(this.curElmClass)) return true;
    }

    // Data for the API.
    get prepareDataForAPI() { // STEP 09
        this.apiData = {
            "user": `${this.apiUrl}users/${this.userID}`, // User URL.
            "title": this.trimedTitle, // Title.
            "slug": this.slug // Slug.
        }; 
    }
    
    // Call the API to edit or delete the title.
    async callAPI() { // STEP 10
        await new Promise(async (resolve, reject) => { 
            try {
                // Map the action types to their corresponding methods.
                const exacute = [ 
                    {'edit': [async () => await this.editionAPI()]},
                    {'delete': [async () => await this.deletionAPI()]},
                ];

                // Function executor.
                await this.module.Func.execute(exacute, this.titleActStore.get);

                resolve();
            } catch (error) {
                reject(error.message);
            }
        });
    }

    // API title edition.
    async editionAPI() {
        try {
            this.response = await this.apiClient.update(this.apiEndPoint, this.apiData);
        } catch (error) { 
            console.log(error.message);
        }
    }

    // API title deletion.
    async deletionAPI() {
        try {
            await this.apiClient.delete(this.apiEndPoint);
            //this.titleActStore.clear;
        } catch (error) {
            console.log(error.message);
        }
    } 

    // Url for the updated title `href` attribute.
    get defineNewUrl() { // STEP 11
        // Get the current action.
        const action = this.titleActStore.get; 
        
        // If the action is delete.
        if (action === 'delete') {
            this.newUrl = this.module.Url.setup('http://', '/chat/', ''); // New url.
            this.updtCurPage = 'chat'; // Update the current page.
        }
        
        // If the action is edit.
        if (action === 'edit') {
            this.newUrl = this.module.Url.setup('http://', '/chat/', `${this.slug}/`); // New url.
            this.updtCurPage = this.slug; // Update the current page.
        }
    }

    // Update the URL in the browser address bar 
    // if the current page is not the home page.
    get updateAddressBar() {// STEP 12
        // If the current page is not the home page.
        if (!this.homePage.includes(this.curPage)) { 

            // Slugify the title from the storage to get the original slug.
            const origSlug = this.module.Slugify.result(this.titleContStore.get);
    
            // Check if the open page is the same as the edited one.
            if (this.curPage == origSlug) { 
                // Update the URL in the browser address bar.
                window.history.pushState({}, '', this.newUrl); 
            }
        }
    }

    // Set the href attribute to the title.
    get setHrefAttrToTitle() {// STEP 13
        this.titleElm.setAttribute('href', this.newUrl);
    }

    get updateCurrentPage() { // STEP 14
        // Update the current page.
        document.getElementById('currentPage').textContent = this.updtCurPage; 
    }

    // Update the title content based on the action.
    get updateTitleContent() {// STEP 15
        // Get the action type.
        const action = this.titleActStore.get;

        // On deletion.
        if (action === 'delete') {
            this.liElm.remove();
        }

        // On edition.
        if (action === 'edit') {
            this.titleContSpan.textContent = this.response.title; // Update the title content.
            this.titleContSpan.contentEditable = false; // Disable content editing.
            this.titleContSpan.style.cursor = 'pointer';
            //this.titleContStore.store = this.trimedTitle; // Store the new title content.
            if (this.response.title.length >= 15) this.ellipsisSpan.show; // Show ellipsis.
            this.titleElm.style.cursor = 'pointer'; // Set cursor to pointer.
            this.titleSpan.removeEventListener('click', this.module.Prevent.click);
            this.target.parent.classList.remove('display-act-btn-confirm'); // ---> class='act-btn-confirm'
        }

        this.titleActStore.clear;
    }

}

// //////////////////////////////////// 

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
        titleAct.clear;
        this.removeBlock;
        this.updateUrl('delete');
    }

    // Call API's edition.
    async edition() {
        this.response = await this.api.update(this.endPoint, this.data);
        console.log(this.response);
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
        console.log('this.elm: ', this.elm);
    }

}

// // Define actions (edit, delete) to topic titles. 
// export class TitleActionBtn {
//     static define(e) {
//         e.preventDefault();
//         try {
//             new BtnSteup(e, titleAct);
//         } catch (error) { 
//             throw new Error(error.message);
//         }
//     }
// }


// class BtnSteup {
//     constructor(e, titleAct) {     
//         this.e = e; // Current button action event.
//         this.init();
//         this.titleAct = titleAct; // The action storage.
//     }

//     async init() {
//         try {
//             // Load necessary functions on event from mixins.js.
//             this.mixins = await loader.load([
//                 'Target', 'APIClient', 'Slugify', 'Func', 'Url', 'Ellipsis']);

//             // Set up the required data.
//             this.elm = new this.mixins.Target(this.e); // Get element for the current event.
//             this.curClasse = this.elm.curClasse(1); // Get element's class attribute.
 
//             // Determine the classes from where a request is accepted.
//             const allowedClasses = [
//                 'geoai-check-icon', 'geoai-trash-icon',
//                 'geoai-x-icon', 'geoai-edit-icon'
//             ]

//             // Check if the request is allowed.
//             if (!allowedClasses.includes(this.curClasse))
//                 return;
            
//             // Front-end functionalitties for action buttons such as: `Edit`, `Delete`, `Close`.
//             this.action = new BtnFrontEndFunc(this.elm);

//             // Button action methods.
//             this.handleAction();

//         } catch (error) {
//             throw new Error(`Something went wrong. ${error.message}`);
//         }
//     }

//     // Prepare and execute button action methods.
//     handleAction() {
//         // Map the elements to their corresponding methods by class attribute.
//         const exacute = [ 
//             {'geoai-check-icon': [() => this.confirm()]}, // Confirm.
//             {'geoai-trash-icon': [() => this.action.delete, () => this.titleAct.store('delete')]}, // Delete.
//             {'geoai-x-icon': [() => this.action.close]}, // Close.
//             {'geoai-edit-icon': [() => this.action.edit, () => this.titleAct.store('edit')]} // Edit.
//         ];

//         // Function executor.
//         this.mixins.Func.execute(exacute, this.curClasse);
//     }

//     confirm() {
//         // Check if the action is allowed.
//         const allowedActs = ['edit', 'delete'];
//         if (!allowedActs.includes(this.titleAct.get))
//             return;
        
//         // Method which prepares everything before sending request to the API client.
//         const PrepRequest = new PrepareRequest(this.e, this.mixins);

//         const exacute = [ // Map the action types to their corresponding methods.
//             {'edit': [() => PrepRequest.edition()]},
//             {'delete': [() => PrepRequest.deletion()]},
//         ];

//         // Function executor.
//         this.mixins.Func.execute(exacute, this.titleAct.get);
//     }
// }

// // Prepare everything and call to the API client methods.
// class PrepareRequest {
//     constructor(e, mixins) {
//         this.e = e; // class='geoai-check-icon'
//         this.mixins = mixins;
//         this.id = this.mixins.Target.id(this.e);
//         this.titleBlock = document.getElementById(`li-${this.id}`); // <li id='li-{{topic.id}}'>   
//         this.curTitle = document.getElementById(`title-${this.id}`);// Title `a` element.
//         this.tiContSpan = this.curTitle.querySelector(`#t-span-${this.id}`); // Title content `span` element.
//         //this.titleElipsis = this.curTitle.querySelector(`#el-span-${this.id}`); // Title elipsis `span` element.
//         console.log(`el-span-${this.id}`);
//         this.ellipsis = new this.mixins.Ellipsis(`el-span-${this.id}`); // Title elipsis `span` element.
//         this.endPoint = `topics/${this.id}/`;
//         this.url = this.mixins.Url.setup('http://','/api/', '');      
//         this.api = new this.mixins.APIClient(this.url); // API Client.
//         this.slug = this.mixins.Slugify.result(this.trimTitle);
//         this.userID = document.getElementById('userID').textContent; // Current user ID.     
//     }

//     // Trim title content.
//     get trimTitle() {
//         return this.tiContSpan.textContent.trim().substring(0, 15);
//     }

//     // Set up a data for the `fetch` method of the APIClient.
//     get data() {
//         return {
//             "user": `${this.url}users/${this.userID}`,
//             "title": this.trimTitle,
//             "slug": this.slug
//         };
//     }

//     // Update urls.
//     updateUrl(action) {
//         const allowedActions = ['edit', 'delete'];
//         if (!allowedActions.includes(action)) return;

//         const curPage = document.getElementById('currentPage').textContent; // Current page.
//         const origSlug = this.mixins.Slugify.result(titleCont.get); // Original slug


//         let newUrl, txtContent;
//         if (action === 'delete') {
//             newUrl = this.mixins.Url.setup('http://', '/chat/', '');
//             txtContent = 'chat'
//         } else if (action === 'edit') {
//             newUrl = this.mixins.Url.setup('http://', '/chat/', `${this.slug}/`);
//             txtContent = this.slug;
//         }

//         const pages = ['chat']; // Page.

//         // Check if current page is not home.
//         if (!pages.includes(curPage)) {
//             // Update only the current topic URL in the browser address bar.
//             if(curPage === origSlug)
//                 window.history.pushState({}, '', newUrl); 
            
//             this.curTitle.setAttribute('href', newUrl);

//             // Update the current page in the chat/index.html.
//             document.getElementById('currentPage').textContent = txtContent;
//             return;
//         }

//         // If current page is home.
//         if (pages.includes(curPage)) {
//             // Update a `href` attribute of the topic title.
//             this.curTitle.setAttribute('href', newUrl);
//         }
//     }

//     // Update title after succesfully response from the server.
//     get updateTitle() {       
//         // If titles length is more than 15, add ellipsis.
//         // const addEllipsis = this.trimTitle.length < 15
//         //     ? this.trimTitle : this.trimTitle + '...';
    
//         // // Set updated content to title.
//         // this.curTitle.textContent = addEllipsis;

//         console.log('In updateTitle(): ', this.titleElipsis);
//         this.tiContSpan.textContent = this.trimTitle;
//         if (this.trimTitle.length >= 15) {
//             this.titleElipsis.classList.remove('hide-ellipsis');
//             this.titleElipsis.classList.add('show-ellipsis');
//         } else {
//             this.titleElipsis.classList.remove('show-ellipsis');
//             this.titleElipsis.classList.add('hide-element');
//         }
            

//         // Add a mouse ponter back.
//         this.curTitle.style.cursor = 'pointer';

//         // Toggling styles of action btn and confirm btn blocks.
//         this.e.target.parentNode.classList
//             .remove('display-act-btn-confirm'); // ---> class='act-btn-confirm'
//         this.e.target.parentNode.previousElementSibling
//             .classList.remove('hide-element'); // class='topic-title-act-btn'
//     }

//     // Remove title from the side bar when is has been deleted in server.
//     get removeBlock() {
//         this.titleBlock.remove();
//     }

//     // Call API's deletetion.
//     async deletion() {
//         await this.api.delete(this.endPoint);
//         titleAct.clear;
//         this.removeBlock;
//         this.updateUrl('delete');
//     }

//     // Call API's edition.
//     async edition() {
//         await this.api.update(this.endPoint, this.data);
//         this.updateTitle;
//         this.updateUrl('edit');
//     }   
// }


// // Set up front-end functionalities for action buttons such as: `Edit`, `Delete`, and `Close`.
// class BtnFrontEndFunc {
//     constructor(e) {
//         this.elm = e; // current: edit, check, trash or close icon.
//         this.titleCont = titleCont; // Storage for title content.
//         this.id = e.target.id;
//         this.curLi = document.getElementById(`li-${this.id}`); // Title parent `<li>` element.
//         this.titleElm = document.getElementById(`title-${this.id}`); //  <a href="{% url 'topic' topic.slug %}"...
//         this.titleContSpan = this.titleElm.querySelector(`#t-span-${this.id}`); // <span id="t-span-{{topic.id}}">...
//         //this.ellipsisSpan = this.titleElm.querySelector(`#el-span-${this.id}`); // <span id="el-span-{{topic.id}}">...    
//         this.titleElm.contentEditable = 'false';
//     }

//     // Front-end of deletion.
//     get delete() {
//         this.curLi.addEventListener('click', Prevent.click);
//         this.titleCont.store(this.titleElm.textContent.trim());
//         this.titleElm.textContent = 'წავშალო?'; // Confirmation text.
//         this.titleElm.focus();
//         this.titleElm.style.cursor = 'default';
//         this.elm.parent.classList.add('hide-element'); // Hide the class='topic-title-act-btn'
//         this.elm.nextSibling.classList.add('display-act-btn-confirm'); // Display confirmation container
//     }

//     // Front-end of closing.
//     get close() {
//         this.curLi.removeEventListener('click', Prevent.click);
//         this.titleElm.style.cursor = 'pointer';
//         this.elm.parent.classList.remove('display-act-btn-confirm'); // ---> class='act-btn-confirm'
//         this.elm.prevSibling.classList.remove('hide-element'); // class='topic-title-act-btn'
//         this.titleContSpan.textContent = this.titleCont.get; // Update with the title content.
//         this.ellipsis.toggle;
//         // this.ellipsisSpan.classList.remove('hide-ellipsis');
//         // this.ellipsisSpan.classList.add('show-ellipsis');
//         // this.titleElm.querySelector('#ellipsis-id').classList.add('show-ellipsis');
//         // this.titleElm.querySelector('#ellipsis-id').classList.remove('hide-ellipsis');
//     }

//     // Front-end of edition.
//     get edit() {
//         this.titleElm.contentEditable = 'true';
//         this.titleElm.style.cursor = 'text';
//         this.titleElm.focus();
//         this.ellipsis.hide;
//         //this.ellipsisSpan.classList.add('hide-ellipsis');
//         //this.titleElm.querySelector(`#el-span-${this.id}`).classList.add('hide-ellipsis');
//         //this.titleElm.querySelector('#ellipsis-id').classList.add('hide-ellipsis');
//         this.titleCont.store(this.titleContSpan.textContent.trim()); // Store title content.
//         this.elm.nextSibling.classList.add('display-act-btn-confirm'); // Display action buttons.
//     }

// }