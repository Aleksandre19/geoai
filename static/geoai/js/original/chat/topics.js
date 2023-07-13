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
        // Dinamicaly import topicTitleActions module.
        import(/* webpackChunkName: "topicTitleActions" */ './topicTitleActions')
            .then(({topicTitleActions}) => {
                topicTitleActions(e);
            });
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
