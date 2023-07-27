import { WebSocketClient } from './websocket'
import { Sidebar } from './sidebar';

// Get slug.
let slug = JSON.parse(document.getElementById('slug').textContent); 

Sidebar.setup; // Setup sidebar.

// instantiate WebSocketClient.
new WebSocketClient(slug); 
