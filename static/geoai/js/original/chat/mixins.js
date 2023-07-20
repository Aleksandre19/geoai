export class GrabElements {
    static for(attr) {
        return Array.from(document.querySelectorAll(attr));
    }
}


export class SetEvent {
    static to(element, event, func) {
        element.forEach(elm => {
            elm.addEventListener(event, func);
        });
    }
}


export class Target {
    constructor(e) {
        this.e = e;
    }
    
    get classes() {
        return this.e.target.className.split(" ");
    }

    // Grabs the element from the right.
    curClasse(nth) {
        return this.classes[this.classes.length - nth];
    }

    get target() {
        return this.e.target;
    }

    get parent() {
        return this.target.parentNode;
    }

    get nextSibling() {
        return this.parent.nextElementSibling;
    }

    get prevSibling() {
        return this.parent.previousElementSibling;
    }

    get topicTitle() {
        return this.parent.parentNode.previousElementSibling;
    }

    setContent(elm, attr, text) {
        elm.querySelector(attr).textContent = text;
    }

    static id(e) {
        return e.target.id;
    }

}



export class GrabID {
    static from(e) {
        return e.target.id;
    }
}


export class CurrentAction {
    static get(act) {
        return act;
    }
}


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


export class CheckLetter {
    static ifGeo(letter) {
        // Georgian letter's RegExp patter.
        const georgianPattern = /[\u10A0-\u10FF]/;

        // Returns true if pattern matches, otherwise false.
        return georgianPattern.test(letter);
    }
}


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


export class Store{
    constructor() {
        this.truck = {}
    }

    store(stp) {
        this.step = stp;
        this.truck[this.step] = this.step;
    }

    get get() {
        return this.truck[this.step];
    }

    get clear() {
        this.truck = {}
    }
}

export class Prevent {
    static click(e) {
        e.preventDefault();
        return false;
    }
}


export class Url{  
    static setup(path, slug) {
        const domain = window.location.host;
        const protocol = 'http://'
        return `${protocol}${domain}${path}${slug}`;
    }
}


export class Element {
    static setup(attr, event, func) {
        const element = GrabElements.for(attr);
        SetEvent.to(element, event, func);
    }
}



