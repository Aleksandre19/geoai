import { WebSocketClient } from './websocket'
import { Sidebar } from './sidebar';

// Get slug.
let slug = JSON.parse(document.getElementById('slug').textContent); 

Sidebar.toggleMode // Set event to mode button.
Sidebar.actionButtons; // Sidebar action buttons.

// instantiate WebSocketClient.
new WebSocketClient(slug); 
