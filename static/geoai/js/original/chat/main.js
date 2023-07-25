import { WebSocketClient } from './websocket'
import { Sidebar } from './sidebar';

// Get slug.
let slug = JSON.parse(document.getElementById('slug').textContent); 

Sidebar.setup; // Setup sidebar.

// instantiate WebSocketClient.
new WebSocketClient(slug); 


// To do:
// 1. New added topic title's edit action doesn't update the url in the address bar,
//    because of the following function:
      // if (curPage === origSlug)
        // window.history.pushState({}, '', newUrl);

// 2. Delete url from the address bar when the topic is deleted.