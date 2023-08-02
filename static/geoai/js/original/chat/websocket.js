import { ModuleLoader } from './utilities';
import { Url } from './mixins';
import { Element } from './utilities';
let catchedModules = null;

// Load modules on event.
const loader = new ModuleLoader([
    { module: 'mixins', func: 'SetEvent' },
    { module: 'mixins', func: 'Prevent' },
    { module: 'mixins', func: 'Button' },
    { module: 'mixins', func: 'Scroll' },
    { module: 'mixins', func: 'Remove' },
    { module: 'mixins', func: 'Url' },
    { module: 'utilities', func: 'Slugify' },
    { module: 'titleActionBtn', func: 'TitleProperties' },
]);


// WebSocket client.
export class WebSocketClient {
    constructor(slug) {
        this.slug = slug; // Current slug.
        this.newTopic = (!slug) ? null : slug;;
        this.socketSlug = (slug) ? slug + '/' : ''; // add a `/` for django urls.
        this.questionSent = false;
        this.init();
    }

    // Initialize the WebSocket.
    init() { // Step 01.   
        // Setup socket url.
        this.socketUrl = Url.setup('ws://', '/ws/chat/', this.socketSlug);

        // Instantiate the WebSocket.
        this.socket = new WebSocket(this.socketUrl); 
        
        this.onClick(); // Step 02.
    }

    onClick() {
        if(!this.questionSent) {
            // Setup button element.
            Element.setup('#chat-message-submit',
                'click', this.eventFunc.bind(this));
        }
    }

    async eventFunc(e) { // Step 03 (Event function)
        if (!this.questionSent) {
            e.preventDefault();

            this.questionInput = document.getElementById('chat-message-input');
            this.questionText = this.questionInput.value; // Get input value.

            // If input is empty, do nothing.
            if (this.questionText == '')
                return;
            
            await this.loadModulesOnEvent(); // Step 04 (Load modules on event).
            this.questionSent = true;
            this.newTopic = this.slug;
            this.topicTitle = this.questionText.slice(0, 15);

            // Disable button.
            this.mixins.Button.disable('#chat-message-submit');
            this.questionProcess(); // Step 05 (Question process)
            
        } else {
            // If the message was sent, do nothing.
            e.preventDefault(); return false;
        }
    }

    // Load modules on event.
    async loadModulesOnEvent() {
        // If modules are already loaded, return them.
        if (catchedModules) return catchedModules;

        try {
            this.mixins = await loader.load([
                'SetEvent', 'Prevent', 'Button', 'Scroll', 'Url',
                'Remove', 'Slugify', 'TitleProperties'   
            ]); 

            catchedModules = this.mixins; // Cache modules.
        } catch (error) {
            this.questionSent = false;
            throw new Error(`Something went wrong. ${error.message}`);
        }
     } 

    async questionProcess() { 
        this.createQaElements; // Step 06 (Create elements).
        this.appendElements; // Step 07 (Append elements to the container).
        this.setContent; // Step 08 (Set content to the element).
        this.mixins.Scroll.toBottom('.chat-qa-content'); // Step 09 (Scroll to bottom).
        this.handleSlug; // Step 10 (If slug is empty, generate slug).
        await this.sendQuestion(); // Step 11 (Send question to the server).
        this.onSocketClose; // Step 12 (Handle socket close).
        await this.receiveAnswer(); // Step 13 (Receive answer from the server).
        this.addTitleToSidebar; // Step 14 (Add title to sidebar).
        this.addActionBtn; // Set up action button to newlly created title.
    }

    get createQaElements() {
        // Loading image url.
        const imageUrl = 'http://' + window.location.host
            + '/static/geoai/images/answer_waiting_gray.gif';
        
        // Setup elements settings.
            // Important notes:
            // 1. Element parent property is the index of the child element.
            // 2. Class and ID names must be as same as it is in the this example.
        const elmList = [
            { elm: 'div', id: 'blockID', class: ['qa-block'], parent: 1, child: null, saveID: 'qaBlock'},
            { elm: 'div', class: ['q-block'], parent: 2, child: 1},
            { elm: 'p', id: 'q-blockID', class: ['q-paragraph', 'b-block-content'], parent: 3, child: 2, saveID: 'qp'},
            { elm: 'div', class: ['a-block', 'skeleton-loading'], parent: 4, child: 1},
            { elm: 'p', id: 'aID', class: ['q-paragraph', 'b-block-content'], parent: 5, child: 4, saveID: 'ap'},
            { elm: 'img', class: ['answer_waiting_gif'], imgUrl: imageUrl, parent: 6, child: 5}
        ]

        // Create elements.
        this.createdElm = Element.create(elmList)
    }

    // Append elements to container.
    get appendElements() {
        Element.appentToContainer(
            this.createdElm, '.chat-qa-content'
        );
    } 
    
    // Set content to the element.
    get setContent() {
        Element.setContent(
            `#${this.createdElm['qp']}`, this.questionText
        );
    }

    // If slug is empty, generate slug.
    get handleSlug() {
        if(!this.slug) {
            this.slug = this.mixins.Slugify.result(
                this.topicTitle
            );
        }
    }

    // Send question to the server.
    async sendQuestion() {
        await new Promise((resolve, reject) => { 
            try {
                this.socket.send(JSON.stringify({
                    'message': this.questionText,
                    'slug': this.slug,
                }));
                resolve();
            } catch (error) {   
                reject(error);
            }
        });
        this.questionInput.value = '';
    }

    // Handle socket close.
    get onSocketClose() { 
        this.socket.onclose = function (e) {
            console.error('Chat socket closed unexpectedly');
        };
    }
    
    // Receive answer from the server.
    async receiveAnswer() {
        await new Promise((resolve, reject) => {
            try {
                this.socket.onmessage = (e) => {
                    this.socketMessage.bind(this)(e);
                    resolve();
                };  
            } catch (error) {
                reject(error);
            }
         });
    }

    // Socket function.
    socketMessage(e) {
        const data = JSON.parse(e.data); // Parse data.
        document.querySelector('.answer_waiting_gif').style.display = 'none'; // Hide loading gif.
        document.querySelector('#' + this.createdElm['ap']).innerHTML = (data.message + '\n'); // Set answer content.
        this.mixins.Remove.Loading(`#${this.createdElm['qaBlock']} > .a-block`, 'skeleton-loading'); // Remove loading gif.
        this.mixins.Button.enable('#chat-message-submit'); // Enable button.
        this.mixins.Scroll.toBottom('.chat-qa-content'); // Scroll to bottom.
        this.slug = data.slug; // Set slug from the response.
        this.topicID = data.topicID // Set topic id from the response.;
        this.questionSent = false;
    }

    get addTitleToSidebar() {
        // If slug is not empty, do nothing.
        if (this.newTopic) return;
        
        if(!this.newTopic) {
            const elmList = [ // Setup elements settings.
                { elm: 'li', id: `li-${this.topicID}`, parent: 1, child: null, saveID: 't-li' },
                { elm: 'a', id: `title-${this.topicID}`, class: ['title-link'], parent: 2, child: 1, saveID: 't-a' },
                { elm: 'span', id: `t-span-${this.topicID}`, class: ['title-span'], parent: 3, child: 2, saveID: 't-span' },
                { elm: 'span', id: `el-span-${this.topicID}`, class: ['hide-ellipsis', 'ell-span'], parent: 4, child: 2, saveID: 'el-span', saveElm: 'elps-span' },
            ];
            this.titleElms = Element.create(elmList); // Create elements.

            // Append elements to container.
            Element.appentToContainer(this.titleElms, '.topic-title-ul', true);        
            
            // Set content to the element.
            Element.setContent(`#${this.titleElms['t-span']}`, this.topicTitle);

            // Set content to the ellipsis.
            Element.setContent(`#${this.titleElms['el-span']}`, '...');
            
            // Show/Hide Ellipsis deppending on the title length.
            if (this.topicTitle.length >= 15) {
                if (this.titleElms['elps-span'].classList.contains('hide-ellipsis'))
                        this.titleElms['elps-span'].classList.remove('hide-ellipsis')
            }

            // Set `href` attribute to the new added title.
            Element.setAttribute(`#${this.titleElms['t-a']}`, 'href', '/chat/' + this.slug);

            // Set attributes to the new added title.
            Element.setElmStyle(`#${this.titleElms['t-a']}`, 
                { 'cursor': 'pointer', 'contenteditable': 'false' });
        }
    }

    // Action buttons.
    get addActionBtn() {
        if (this.newTopic) return; // If the topic already exists, do nothing.

        const elmList = [ // Setup elements settings.
            { elm: 'div', id: 'ID', class: ['act-wrapper'], parent: 1, child: null, saveID: 'rootID'},
            { elm: 'div', id: 'btnsID', class: ['topic-title-act-btn'], parent: 2, child: 1 },
            { elm: 'a', id: `${this.topicID}`, class: ['geoai-icons', 'geoai-edit-icon'], parent: 3, child: 2 },
            { elm: 'a', id: `${this.topicID}`, class: ['geoai-icons', 'geoai-trash-icon'], parent: 4, child: 2 },
            { elm: 'div', id: 'btnsID', class: ['act-btn-confirm'], parent: 5, child: 1 },
            { elm: 'a', id: `${this.topicID}`, class: ['geoai-icons', 'geoai-check-icon'], parent: 6, child: 5 },
            { elm: 'a', id: `${this.topicID}`, class: ['geoai-icons', 'geoai-x-icon'], parent: 7, child: 5 },
        ];
        this.titleActElms = Element.create(elmList);//

        // Append elements to container.
        Element.appentToContainer(this.titleActElms, `#${this.titleElms['t-li']}`);

        // Get all links.
        const newLinks = this.titleActElms[1].querySelectorAll('.geoai-icons'); 

        // Set attributies and events to the action buttons.
        newLinks.forEach(element => {
            element.setAttribute('href', '#');
            this.mixins.SetEvent.to([element], 'click', (e) => new this.mixins.TitleProperties(e));
        });

        // Update url in the address bar.
        const newUrl = this.mixins.Url.setup('http://', '/chat/', this.slug);
        this.mixins.Url.addressBar(newUrl);

        // Update the current page in the chat/index.html.
        document.getElementById('currentPage').textContent = this.slug;
    }
}
