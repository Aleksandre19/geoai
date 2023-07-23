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
        this.slug = (slug) ? slug + '/' : '';
        this.questionSent = false;
        this.init();
    }

    // Initialize the WebSocket.
    init() { // Step 01.   
        // Setup socket url.
        this.socketUrl = Url.setup('ws://', '/ws/chat/', this.slug);

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
            
            try {
                // Step 04 (Load modules)
                this.mixins = await loader.load([
                    'SetEvent', 'Prevent', 'Button',
                    'Scroll', 'Remove', 'Slugify'
                ]); 

                this.questionSent = true;

                // Disable button.
                this.mixins.Button.disable('#chat-message-submit');

                this.questionProcess; // Step 05 

            } catch (error) {
                this.questionSent = false;
                throw new Error(`Something went wrong. ${error.message}`);
            }
            
        } else {
            // If the message was sent, do nothing.
            e.preventDefault(); return false;
        }
    }

    get questionProcess() { 
        this.createQaElements; // Step 06 (Create elements).
        this.appendElements; // Step 07 (Append elements to the container.)
        this.setContent; // Step 08 (Set content to the element.)
        this.mixins.Scroll.toBottom('.chat-qa-content'); // Step 09 (Scroll to bottom.)
        this.handleSlug; // Step 10 (If slug is empty, generate slug.)
        this.sendQuestion; // Step 11 (Send question to the server.)
        this.addTitleToSidebar; // Step 12 (Add title to sidebar.)
        this.onSocketClose; // Step 13 (Handle socket close.)
        this.receiveAnswer; // Step 14 (Receive answer from the server.)
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
        if(this.slug == '') {
            this.slug = this.mixins.Slugify.result(
                this.questionText.slice(0, 20)
            );
        }
    }

    // Send question to the server.
    get sendQuestion() { 
        this.socket.send(JSON.stringify({
            'message': this.questionText,
            'slug': this.slug,
        }));
        this.questionInput.value = '';
    }

    // Handle socket close.
    get onSocketClose() { 
        this.socket.onclose = function (e) {
            console.error('Chat socket closed unexpectedly');
        };
    }
    
    // Receive answer from the server.
    get receiveAnswer() {
        this.socket.onmessage = this.socketMessage.bind(this);
    }

    // Socket function.
    socketMessage(e) {
        const data = JSON.parse(e.data); // Parse data.
        document.querySelector('.answer_waiting_gif').style.display = 'none'; // Hide loading gif.
        document.querySelector('#' + this.createdElm['ap']).innerHTML = (data.message + '\n'); // Set answer content.
        this.mixins.Remove.Loading(`#${this.createdElm['qaBlock']} > .a-block`, 'skeleton-loading'); // Remove loading gif.
        this.mixins.Button.enable('#chat-message-submit'); // Enable button.
        this.mixins.Scroll.toBottom('.chat-qa-content'); // Scroll to bottom.
        this.questionSent = false;
    }
}
