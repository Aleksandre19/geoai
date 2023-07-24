import { ModuleLoader } from './utilities';
import { Url } from './mixins';
import { Element } from './utilities';

// Load modules on event.
const loader = new ModuleLoader([
    { module: 'mixins', func: 'SetEvent' },
    { module: 'mixins', func: 'Prevent' },
    { module: 'mixins', func: 'Button' },
    { module: 'mixins', func: 'Scroll' },
    { module: 'mixins', func: 'Remove' },
    { module: 'utilities', func: 'Slugify' },
]);


// WebSocket client.
export class WebSocketClient {
    constructor(slug) {
        this.slug = slug; // Current slug.
        this.newTopic = (!slug) ? null : slug;;
        this.socketSlug = (slug) ? slug + '/' : ''; // add `/` for django urls.
        this.questionSent = false;
        this.init();
        // console.log('Constructor newTopic', this.newTopic);
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
            // console.log('eventFunc newTopic', this.newTopic);
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
        try {
            this.mixins = await loader.load([
                'SetEvent', 'Prevent', 'Button',
                'Scroll', 'Remove', 'Slugify'
            ]); 
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
    }

    get createQaElements() {
        // Loading image url.
        const imageUrl = 'http://' + window.location.host + '/static/geoai/images/answer_waiting_gray.gif';
        
        // Setup elements settings.
            // Important notes:
            // 1. Element parent property is the index of the child element.
            // 2. Class and ID names must be as same as it is in the this example.
        const elmList = [
            { elm: 'div', id: 'blockID', classe: ['qa-block'], parent: 1, child: null},
            { elm: 'div', classe: ['q-block'], parent: 2, child: 1},
            { elm: 'p', id: 'q-blockID', classe: ['q-paragraph', 'b-block-content'], parent: 3, child: 2},
            { elm: 'div', classe: ['a-block', 'skeleton-loading'], parent: 4, child: 1},
            { elm: 'p', id: 'aID', classe: ['q-paragraph', 'b-block-content'], parent: 5, child: 4},
            { elm: 'img', classe: ['answer_waiting_gif'], imgUrl: imageUrl, parent: 6, child: 5}
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
                this.questionText.slice(0, 20)
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
        this.slug = data.slug;
        this.questionSent = false;
    }

    get addTitleToSidebar() {
        // console.log('eventFunc newTopic', this.newTopic);
        if (this.newTopic) return; // If slug is not empty, do nothing.

        if(!this.newTopic) {
            const elmList = [
                { elm: 'li', id: 'li-ID', parent: 1, child: null },
                { elm: 'a', id: 'a-ID', parent: 2, child: 1 },
            ];
            const titleElms = Element.create(elmList);
            // console.log(titleElms);
        }
    }
}
