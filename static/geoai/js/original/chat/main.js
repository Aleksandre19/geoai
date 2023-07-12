import { createChatSocket } from './websocket'
import { Slugify } from "./slugify";
import { APIClient } from './topics';

//  Get slug from {{ slug|json_script:'chat-name'}} in chag/index.html.
let slug = JSON.parse(document.getElementById('chat-name').textContent);
createChatSocket(slug) // Run websocket.

// Testing.
const updated_title = 'da me მე და ალიკა'
// const converted = convertToGeorgian(updated_title)
const slugify = new Slugify();
const slugA = slugify.slug(updated_title)
const api = new APIClient('http://127.0.0.1:8000/api/')
const data = {
    "user": "http://127.0.0.1:8000/api/users/aleksandre.development@gmail.com",
    "title": updated_title,
    "slug": slugA
}

// console.log(data)
// const p = api.update('topics/30/', data)
// console.log(p)