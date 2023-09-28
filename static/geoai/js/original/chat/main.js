import { WebSocketClient } from './websocket'
import { Sidebar } from './sidebar';

// Get slug.
let slug = JSON.parse(document.getElementById('slug').textContent); 

// Instantiate Sidebar.
new Sidebar();

// Instantiate WebSocketClient.
new WebSocketClient(slug); 
