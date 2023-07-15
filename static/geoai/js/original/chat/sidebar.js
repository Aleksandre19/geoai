/*
    This script adds interection to the topic title's action buttons
    such as Edit, Delete, Approve and close.
*/
import { Element, SetEvent, GrabElements } from './mixins';
import { ModuleLoader } from './mixins'
import { APIClient } from './apiClient';

let loader = new ModuleLoader([
    { module: 'mixins', func: 'GrabID' },
    { module: 'mixins', func: 'Slugify' },
    { module: 'mixins', func: 'CurrentAction' },
    { module: 'topicTitleActions', func: 'topicTitleActions' },
]);

let actionWrapper = GrabElements.from('.act-wrapper');
actionWrapper.forEach(element => {

    const actBtnConfirm = GrabElements.from('.act-btn-confirm');

    function actEventFunc(){
        this.classList.remove('display-act-btn-confirm');
        this.querySelector('.confirm-msg').contentEditable = false;
    };

    SetEvent.to(actBtnConfirm, 'mouseleave', actEventFunc);
    
    const elmEventFunc = (e) => {
        e.preventDefault();
        // const elmModulesList = [{ module: 'topicTitleActions', func: 'topicTitleActions' }];
        // const elmImports = new ModuleLoader(elmModulesList);
        loader.load(['topicTitleActions']).then(mixins => {
            mixins.topicTitleActions(e);
        });
    }
    SetEvent.to([element], 'click', elmEventFunc);
});



// Testing 



function testFunc(e) {
    e.preventDefault();
    loader.load(['Slugify', 'GrabID', 'CurrentAction']).then(mixins => {
        const url = 'http://' + window.location.host + '/api/';
        const id = mixins.GrabID.from(e);
        console.log(id)
        const endPoint = `topics/${id}/`;

        const updated_title = 'da me vashaaaa'
        // const slugify = mixins.Slugify();
        const slugA = mixins.Slugify.result(updated_title)
        const data = {
            "user": "http://127.0.0.1:8000/api/users/aleksandre.development@gmail.com",
            "title": updated_title,
            "slug": slugA
        }

        const api = new APIClient(url)
        const current = mixins.CurrentAction.get('update'); // Testing
        console.log(current)
        if (current == 'delete') {
            api.delete(endPoint)
        } else if (current == 'update') {
            if (data) {
                console.log('data')
                api.update(endPoint, data)
            }
        }
        console.log(url);
    });
    
}

Element.setup('.geoai-check-icon', 'click', testFunc);

// // Get Cookies
// class Cookie {
//     constructor(name) {
//         this.name = name;
//     }

//     _decodeCookie(cookie) {
//             return decodeURIComponent(cookie.split('=')[1]);
//     }

//     get(){
//         const cookieValue = document.cookie
//         .split('; ')
//         .find(raw => raw.startsWith(this.name + '='));
//         return cookieValue ? this._decodeCookie(cookieValue) : null;

//     }
// }

// // Deleting and updating topics.
// export class APIClient {
//     constructor(baseUrl){
//         this.baseUrl = baseUrl
//         this.cookie = new Cookie('csrftoken')
//         this.errorText = 'ვერ მოხერხდა მოთხოვნის შესრულება, გთხოვთ ცადოთ ახლიდან. ';
//     }


//     async _request(method, endpoint, data){
//         let response;

//         try {
//             response = await fetch(`${this.baseUrl}${endpoint}`,{
//                 method: method,
//                 headers: {
//                     'Content-type' : 'application/json',
//                     'x-CSRFToken': this.cookie.get(),
//                 },
//                 credentials: 'same-origin',
//                 body: data ? JSON.stringify(data) : null
//             });
//         } catch (error) {
//             throw new Error(this.errorText + error)
//         }

//         if (!response.ok) {
//             throw new Error(this.errorText + response.statusText)
//         }

//         if (response.status != 204) {
//             return response.json();
//         } else {
//             return null;
//         } 
        
//     }

//     async update(endpoint, data) {
//         return this._request('PUT', endpoint, data)
//     }

//     async delete(endpoint) {
//         return this._request('DELETE', endpoint);
//     }
// }
