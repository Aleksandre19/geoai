import { createChatSocket } from './websocket'
import * as topic from './sidebar';

//  Get slug from {{ slug|json_script:'chat-name'}} in chag/index.html.
let slug = JSON.parse(document.getElementById('chat-name').textContent);
createChatSocket(slug) // Run websocket.


// Testing.





// const approveElms = document.querySelectorAll('.geoai-check-icon');
// approveElms.forEach(approve => {
//     approve.addEventListener('click', (e) => {
//         e.preventDefault();
//         console.log('Approved')
//     });
// });




// const updated_title = 'da me მე და ალიკა'
// const converted = convertToGeorgian(updated_title)
// const slugify = new Slugify();
// const slugA = slugify.slug(updated_title)

// const data = {
//     "user": "http://127.0.0.1:8000/api/users/aleksandre.development@gmail.com",
//     "title": updated_title,
//     "slug": slugA
// }



// console.log(data)
// const p = api.update('topics/30/', data)
// console.log(p)