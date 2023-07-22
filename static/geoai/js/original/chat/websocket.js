import { ModuleLoader } from './utilities';
import { SetEvent, Url } from './mixins';

const loader = new ModuleLoader([
    { module: 'mixins', func: 'SetEvent' },
    { module: 'mixins', func: 'Element' },
    { module: 'mixins', func: 'Prevent' },
    { module: 'mixins', func: 'Disable' },
]);

import {
    removeLoading,
    enableButton,
    aID
} from './websocketHelpers'


// Generate a WebSocket URL.
const generateUrl = (slug) => {
    if (slug == null) {
        slug = '';
    } else {
        slug = slug + '/'
    }
    const url = 'ws://' + window.location.host + '/ws/chat/'+ slug
    return url
}

class WebSocketClient {
    constructor(slug) {
        this.slug = (typeof slug == 'undefined') ? '' : slug;
        this.init();
    }

    init() { // Step 01.
        this.socketUrl = Url.setup('ws://', '/ws/chat/', this.slug);
        this.socket = new WebSocket(this.socketUrl);

        this.onClick();
    }

    async onClick() { // Step 02.
        try {
            // Load modules.
            this.mixins = await loader.load(['Element',
                'SetEvent', 'Prevent', 'Disable']); 
            
            // Setup button element.
            this.mixins.Element.setup('#chat-message-submit',
                'click', this.eventFunc.bind(this)); 
            
        } catch (error) {
            throw new Error(`Something went wrong. ${error.message}`);
        }
    }

    eventFunc(e) { // Onclick event (Step 03)
        this.mixins.Prevent.click(e);
        const msgInput = document.getElementById('chat-message-input').value;

        if (msgInput == '')
             return;     
        
        this.mixins.Disable.btn('#chat-message-submit');
        
        this.questionProcess;
    }

    get questionProcess() { // Step 04
        this.createQaHtml;
    }

    get createQaHtml() { // Step 05
        const imageUrl = 'http://' + window.location.host + '/static/geoai/images/answer_waiting_gray.gif';
        const elmList = [
            { elm: 'div', id: 'ID', classe: ['qa-block'], parent: 1, child: null},
            { elm: 'div', classe: ['q-block'], parent: 2, child: 1},
            { elm: 'p', id: 'q-blockID', classe: ['q-paragraph', 'b-block-content'], parent: 3, child: 2},
            { elm: 'div', classe: ['a-block', 'skeleton-loading'], parent: 4, child: 1},
            { elm: 'p', id: 'aID', classe: ['q-paragraph', 'b-block-content'], parent: 5, child: 4},
            { elm: 'img', classe: ['answer_waiting_gif'], imgUrl: imageUrl, parent: 6, child: 5}
        ]
        this.mixins.Element.create(elmList);
    }

}

const testSocket = new WebSocketClient();

// Instantiate the WebSocket.
export function createChatSocket(slug) {
    const chatSocket = new WebSocket(generateUrl(slug));

    chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        //const formattedtText = textFormat(data.message);
        document.querySelector('.answer_waiting_gif').style.display = 'none';
        document.querySelector('#' + aID()).innerHTML = (data.message + '\n');

        removeLoading(); // Removie loading effect.
        enableButton('#chat-message-submit') // Enable submit button.
    };


    chatSocket.onclose = function (e) {
        console.error('Chat socket closed unexpectedly');
    };


    document.querySelector('#chat-message-submit').onclick = function (e) {
        // Dinamicaly import websocket_helpers module.
        import(/* webpackChunkName: "websocket_helpers" */ './websocketHelpers').then(({
            disableButton,
            question,
            addTopicTitle,
            scrollBottom
        }) => {
            const messageInputDom = document.querySelector('#chat-message-input');
            const message = messageInputDom.value;
            disableButton('#chat-message-submit')
            
            question(message);
            if (slug == null) {
                slug = addTopicTitle(message.slice(0, 20)).slug;
            }
            scrollBottom();
            
            chatSocket.send(JSON.stringify({
                'message': message,
                'slug': slug,
            }));
            messageInputDom.value = '';
        });
    };


    return chatSocket;
}
