import { ModuleLoader } from './utilities';
import { Store } from './mixins';
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
        if (!this.approvedAct) return; // STEP 09 (Check if the action is approved.)
        this.prepareDataForAPI; // STEP 10 (Prepare data for API.)
        await this.callAPI(); // STEP 11 (This method calls eather `edit` or `delete` action,
                             // based on titleActStore, in which a desiered action is stored
                             // when the user clicks on the `edit` or `delete` icons.)
        this.defineNewUrl; // STEP 12 (Define new url.)
        this.updateAddressBar; // STEP 13 (Update address bar.)
        this.setHrefAttrToTitle; // STEP 14 (Set href attribute to title.)
        this.updateCurrentPage; // STEP 15 (Update current page.)
        this.updateTitleContent; // STEP 16 (Update title content.)
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
        this.target.nextSibling.classList.add('display-act-btn-confirm'); // Display confirmation container
        if (this.titleContStore.get.length >= 15) this.ellipsisSpan.toggle; // Hide ellipsis.
    }

    // Cancel current action.
    get cancelAction() { // STEP 06
        this.titleSpan.removeEventListener('click', this.module.Prevent.click); // Remove event listener.
        this.titleSpan.style.cursor = 'pointer';
        this.target.parent.classList.remove('display-act-btn-confirm'); // ---> class='act-btn-confirm'
        this.titleContSpan.textContent = this.titleContStore.get; // Update with the title content.
        if (this.titleContStore.get.length >= 15) this.ellipsisSpan.toggle; // Hide ellipsis.
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

    get onMouseLeave() { // STEP 08
        this.module.SetEvent.to([this.liElm], 'mouseleave', () => {
            
            // Check if the action is allowed.
            const allowedActions = ['edit', 'delete'];
            if (!allowedActions.includes(this.titleActStore.get)) return;

            const curAction = this.titleActStore.get; // Get current action.

            // Hide action buttons.
            if(this.actBtnContainer.classList.contains('display-act-btn-confirm'))
                this.actBtnContainer.classList.remove('display-act-btn-confirm');
            
            if (curAction === 'delete')
                this.titleContSpan.textContent = this.titleContStore.get; // Back the original content.
            
            if (curAction === 'edit') {
                this.titleContSpan.textContent = this.titleContStore.get; // Back the original content.
                this.titleContSpan.contentEditable = 'false';
                this.titleSpan.style.cursor = 'pointer'; // Default cursor.
                this.titleContSpan.blur(); // Remove focus.
            }

            // Toggle ellipsis.
            if (this.titleContStore.get.length >= 15) this.ellipsisSpan.toggle; 

            this.titleActStore.clear; // Clear title action store.
            this.titleContStore.clear; // Clear title content store.
                
        });  
    }

    // Check if the action is allowed.
    get approvedAct() {  // STEP 09
        const allowedActs = ['geoai-check-icon'];
        if (allowedActs.includes(this.curElmClass)) return true;
    }

    // Data for the API.
    get prepareDataForAPI() { // STEP 10
        this.apiData = {
            "user": `${this.apiUrl}users/${this.userID}`, // User URL.
            "title": this.trimedTitle, // Title.
            "slug": this.slug // Slug.
        }; 
    }
    
    // Call the API to edit or delete the title.
    async callAPI() { // STEP 11
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
        } catch (error) {
            console.log(error.message);
        }
    } 

    // Url for the updated title `href` attribute.
    get defineNewUrl() { // STEP 12
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
    get updateAddressBar() {// STEP 13
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
    get setHrefAttrToTitle() {// STEP 14
        this.titleElm.setAttribute('href', this.newUrl);
    }

    get updateCurrentPage() { // STEP 15
        // Update the current page.
        document.getElementById('currentPage').textContent = this.updtCurPage; 
    }

    // Update the title content based on the action.
    get updateTitleContent() {// STEP 16
        // Get current action.
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
            if (this.response.title.length >= 15) this.ellipsisSpan.show; // Show ellipsis.
            this.titleElm.style.cursor = 'pointer'; // Set cursor to pointer.
            this.titleSpan.removeEventListener('click', this.module.Prevent.click);
            this.target.parent.classList.remove('display-act-btn-confirm'); // ---> class='act-btn-confirm'
        }

        this.titleActStore.clear; // Clear title action store.
    }

}
