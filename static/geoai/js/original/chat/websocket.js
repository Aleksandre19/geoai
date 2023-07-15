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
