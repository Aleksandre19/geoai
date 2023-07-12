/*
    This script adds interection to the topic title's action buttons
    such as Edit, Delete, Approve and close.
*/

// Grab wrapper element of action buttons
const actionWrapper = document.querySelectorAll('.act-wrapper');
actionWrapper.forEach(element => {
    // Grab action buttons container
    const actBtnConfirm = element.querySelector('.act-btn-confirm');
    // Set a mouseleave evente to action buttons container.
    actBtnConfirm.addEventListener('mouseleave', function(e) {
        this.classList.remove('display-act-btn-confirm');
        this.querySelector('.confirm-msg').contentEditable = false;
    });

    element.addEventListener('click', function(e){
        e.preventDefault();
        const target = e.target; // Get current element
        const classNames = target.className.split(" "); // Grab current element's class attributes
        const currentElm = classNames[classNames.length - 1]; // Current element's class name
        // If action is deletion
        if(currentElm == 'geoai-trash-icon'){
            // Add alert text to deletion.
            const actBtn = target.parentNode.nextElementSibling;
            actBtn.querySelector('.confirm-msg').textContent = 'წავშალო?';

            // Hide action buttons and open confirmation dialog box
            target.parentNode.classList.add('hide-element'); // class='topic-title-act-btn'
            const nextSibling = target.parentNode.nextElementSibling; // class='act-btn-confirm'
            nextSibling.classList.add('display-act-btn-confirm'); // Display confirmation container
        
        // If action is closing current action
        }else if (currentElm == 'geoai-x-icon'){
            target.parentNode.classList.remove('display-act-btn-confirm'); // class='act-btn-confirm'
            const prevSibling = target.parentNode.previousElementSibling; // class='topic-title-act-btn'
            prevSibling.classList.remove('hide-element');
        
            // If action is editions of topic title
        }else if(currentElm == 'geoai-edit-icon'){
            // Topic title 'a' element
            const topicTitle = target.parentNode.parentNode.previousElementSibling;    
            const nextSibling = target.parentNode.nextElementSibling; // class='act-btn-confirm'
            // Grab message element
            const actMsg = nextSibling.querySelector(`p.confirm-msg`); // class='confirm-msg'
            // Display action buttons
            nextSibling.classList.add('display-act-btn-confirm');
            // Add title content to action's message
            actMsg.textContent = topicTitle.textContent.trim();
            // Make editable message element
            actMsg.contentEditable = true; // class='confirm-msg'
            // Auto focus message element
            actMsg.focus(); // class='confirm-msg'
        }
    });
});


// Get Cookies
class Cookie {
    constructor(name) {
        this.name = name;
    }

    _decodeCookie(cookie) {
            return decodeURIComponent(cookie.split('=')[1]);
    }

    get(){
        const cookieValue = document.cookie
        .split('; ')
        .find(raw => raw.startsWith(this.name + '='));
        return cookieValue ? this._decodeCookie(cookieValue) : null;

    }
}

// Deleting and updating topics.
export class APIClient {
    constructor(baseUrl){
        this.baseUrl = baseUrl
        this.cookie = new Cookie('csrftoken')
        this.errorText = 'ვერ მოხერხდა მოთხოვნის შესრულება, გთხოვთ ცადოთ ახლიდან. ';
    }


    async _request(method, endpoint, data){
        let response;

        try {
            response = await fetch(`${this.baseUrl}${endpoint}`,{
                method: method,
                headers: {
                    'Content-type' : 'application/json',
                    'x-CSRFToken': this.cookie.get(),
                },
                credentials: 'same-origin',
                body: data ? JSON.stringify(data) : null
            });
        } catch (error) {
            throw new Error(this.errorText + error)
        }

        if (!response.ok) {
            throw new Error(this.errorText + response.statusText)
        }

        if (response.status != 204) {
            return response.json();
        } else {
            return null;
        } 
        
    }

    async update(endpoint, data) {
        return this._request('PUT', endpoint, data)
    }

    async delete(endpoint) {
        return this._request('DELETE', endpoint);
    }
}
