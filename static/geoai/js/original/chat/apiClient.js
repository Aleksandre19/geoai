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

        if (!response.ok)
            throw new Error(this.errorText + response.statusText);
        
        if(response.ok) {
            // console.log('success');
            return response.ok;
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