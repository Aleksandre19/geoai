// Grab elements from the DOM.
export class GrabElements {
    static for(attr) {
        // Return an array of elements.
        return Array.from(document.querySelectorAll(attr));
    }

    // Grab single element.
    static single(attr) {
        return document.querySelector(attr);
    }
}


// Set event to element.
export class SetEvent {
    static to(element, event, func) {     
        element.forEach(elm => {
            // Set event to element.
            elm.addEventListener(event, func);
        });
    }
}


export class Target { 
    constructor(e) {
        this.e = e;
    }
    
    // Get element's classes.
    get classes() {
        // Split the class attribute by space.
        return this.e.target.className.split(" ");
    }

    // Get element's class last attribute.
    curClasse(nth) {
        return this.classes[this.classes.length - nth];
    }

    // Get the element that triggered the event.
    get target() {
        return this.e.target;
    }

    // Get the parent element of the element that triggered the event.
    get parent() {
        return this.target.parentNode;
    }

    // Get the parent element's next element.
    get nextSibling() {
        return this.parent.nextElementSibling;
    }

    // Get the parent element's previous element.
    get prevSibling() {
        return this.parent.previousElementSibling;
    }


    get topicTitle() {
        // Get the parent element's previous element.
        return this.parent.parentNode.previousElementSibling;
    }

    // Set content to element.
    setContent(elm, attr, text) {
        elm.querySelector(attr).textContent = text;
    }

    // Get element's id.
    static id(e) {
        return e.target.id;
    }

}


// Get the element's id that triggered the event.
export class GrabID {
    static from(e) {
        return e.target.id;
    }
}


// Get current action.
export class CurrentAction {
    static get(act) {
        return act;
    }
}


// Georgian to English characters.
export class Chars {
    static get geoEng() {
        return {
            'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v',
            'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm',
            'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's',
            'უ': 'u', 'ფ': 'f', 'ქ': 'q', 'ღ': 'gh', 'ყ': 'k', 'შ': 'sh',
            'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh',
            'ჯ': 'j', 'ჰ': 'h', ' ': ' '
        }
    }
}


// Get text and return slug.
export class Slug {
    static get(text){ 
        return text
            .toString()         // Convert to a string
            .toLowerCase()      // Convert the string to lower case
            .trim()             // Remove spaces from the start and end of the string
            .replace(/\s+/g, '-')   // Replace spaces with -
            .replace(/[^\w\-]+/g, '')   // Remove all non-word characters
            .replace(/\-\-+/g, '-');  // Replace multiple - with single -
    }
}


// Check if the letter is Georgian.
export class CheckLetter {
    static ifGeo(letter) {
        // Georgian letter's RegExp patter.
        const georgianPattern = /[\u10A0-\u10FF]/;

        // Returns true if pattern matches, otherwise false.
        return georgianPattern.test(letter);
    }
}


// Convert Georgian to English.
export class Convert {
    static toEng(text) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            // If the letter is Georgian and it is in chars dict. 
            if (CheckLetter.ifGeo(text[i]) && text[i] in Chars.geoEng) {
                result += Chars.geoEng[text[i]];
            } else {
                result += text[i];
            } 
        }
        return result;
    }
}


// Storage for title content.
export class Store{ 
    constructor() {
        this.truck = {}
    }

    // Store title content.
    store(stp) {
        this.step = stp;
        this.truck[this.step] = this.step;
    }

    // Get title content.
    get get() {
        return this.truck[this.step];
    }

    // Clear title content.
    get clear() {
        this.truck = {}
    }
}

// Prevent default action.
export class Prevent { 
    static click(e) {
        e.preventDefault();
        return false;
    }
}


// Generate url for API.
export class Url {
    static setup(protocol, path, slug) {   
        const domain = window.location.host; // Get domain name.
        return `${protocol}${domain}${path}${slug}`;
    }
}


// Button functionalities.
export class Button {
    // Disable button.
    static disable(attr) {
        const elm = GrabElements.single(attr);
        elm.disabel = true;
        elm.classList.add('disabled-btn');
    }

    // Enable button.
    static enable(attr) {
        const elm = GrabElements.single(attr);
        elm.disabel = false;
        elm.classList.remove('disabled-btn');
    }
}


// Scroll to bottom.
export class Scroll { 
    static toBottom(attr) {
        const element = document.querySelector(attr);
        element.scrollTo({ top: element.scrollHeight, behaviour: 'smooth' }); 
    }
}


 // Remove loading gif.
export class Remove {
    static Loading(attr, attr2) {
        const elm = document.querySelector(attr);
        elm.classList.remove(attr2);
    }
}


// Jus for remainder. 
// i = (i + 1) % array.length ---> `i` will not go over the length of the array.



