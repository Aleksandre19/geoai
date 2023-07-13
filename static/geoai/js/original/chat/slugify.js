// This is a title's slugifyer class.
// It checks it the letter in the title is Georgian,
// If yes, it converts to Georgian letter and, 
// finally sluglifyes the final string.
export class Slugify {
    constructor() {
        this.chars = {
            'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v',
            'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm',
            'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's',
            'უ': 'u', 'ფ': 'f', 'ქ': 'q', 'ღ': 'gh', 'ყ': 'k', 'შ': 'sh',
            'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh',
            'ჯ': 'j', 'ჰ': 'h', ' ': ' '
        }
    }

    _slugify(text) {
        return text
            .toString()         // Convert to a string
            .toLowerCase()      // Convert the string to lower case
            .trim()             // Remove spaces from the start and end of the string
            .replace(/\s+/g, '-')   // Replace spaces with -
            .replace(/[^\w\-]+/g, '')   // Remove all non-word characters
            .replace(/\-\-+/g, '-');  // Replace multiple - with single -
    }

    // Check if letter is Georgian.
    _checkLetter(letter) {
        // Georgian letter's RegExp patter.
        const georgianPattern = /[\u10A0-\u10FF]/;

        // Returns true if pattern matches, otherwise false.
        return georgianPattern.test(letter);
    }

    
    // Convert Georgian text to English.
    _toEnglish(text) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            // If the letter is Georgian and it is in chars dict. 
            if (this._checkLetter(text[i]) && text[i] in this.chars) {
                result += this.chars[text[i]];
            } else {
                result += text[i];
            } 
        }
        return result;
    }

    slug(text) {
        return text ? this._slugify(this._toEnglish(text)) : null;
    }
}