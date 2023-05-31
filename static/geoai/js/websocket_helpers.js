// Grab the while QA container.
const chatQaContent = document.querySelector('.chat-qa-content')
let answerID;

// Automaticaly scroll down after each question.
const scrollBottom = () => {
    const element = document.querySelector('.chat-qa-content');
    element.scrollTo({top:element.scrollHeight, behaviour: 'smooth'});
}


// Generate random IDs.
const generateID = () => {
    // Generate a unique value for adding to ID
    const uv = Date.now().toString()
    return 'qa' + uv;
}


// Create QA elements.
const createElements = (qaBlockID) => {

    const qaBlock = document.createElement('div')
    qaBlock.classList.add('qa-block');
    qaBlock.id = qaBlockID;

    const questionWrapper = document.createElement('div')
    const questionParagraph = document.createElement('p')
    questionWrapper.classList.add('q-block');
    questionParagraph.classList.add('q-paragraph', 'b-block-content');
    questionParagraph.id = 'q-block' + qaBlockID

    const answerWrapper = document.createElement('div')
    const answerParagraph = document.createElement('p')
    answerWrapper.classList.add('a-block');
    answerParagraph.classList.add('q-paragraph', 'b-block-content');
    answerID = 'a' + qaBlockID;
    answerParagraph.id = answerID;

    // Loading gif.
    const loading = document.createElement('img');
    loading.classList.add('answer_waiting_gif'); 
    const loadingUrl = 'http://' + window.location.host + '/static/geoai/images/answer_waiting_gray.gif';
    loading.setAttribute('src', loadingUrl);

    questionWrapper.appendChild(questionParagraph)
    answerParagraph.appendChild(loading);
    answerWrapper.appendChild(answerParagraph)

    qaBlock.appendChild(questionWrapper)
    qaBlock.appendChild(answerWrapper)

    chatQaContent.appendChild(qaBlock);

    return {
        'qaBlock': qaBlock,
        'questionParagraph': questionParagraph,
        'answerParagraph': answerParagraph
    }
}


const insertContent = (message, id) => {
    const element = document.querySelector('#' + id);
    element.innerHTML = message
}


const question = (message) => {
    const qaBlockID = generateID();
    const elements = createElements(qaBlockID);
    insertContent(message, elements.questionParagraph.id);
}


// Slugify the string
const slugify = (text) => {
    return text
        .toString()         // Convert to a string
        .toLowerCase()      // Convert the string to lower case
        .trim()             // Remove spaces from the start and end of the string
        .replace(/\s+/g, '-')   // Replace spaces with -
        .replace(/[^\w\-]+/g, '')   // Remove all non-word characters
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}


// Map the Georgian Alphabet to English.
const georgianToEnglish = {
    'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v',
    'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm',
    'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's',
    'უ': 'u', 'ფ': 'f', 'ქ': 'q', 'ღ': 'gh', 'ყ': 'k', 'შ': 'sh',
    'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh',
    'ჯ': 'j', 'ჰ': 'h', ' ': ' '
};


// Convert Georgian letter to English.
const convertToGeorgian = (text) => {
    let result = '';
    for (let char of text.toLowerCase()) {
        if (char in georgianToEnglish) {
            result += georgianToEnglish[char];
        } 
    }
    return result;
}


const addTopicTitle = (title) => {
    const ulElement = document.querySelector('.chat-history-links ul')

    const liElement = document.createElement('li');
    const aElement = document.createElement('a');

    const toEnglish = convertToGeorgian(title);
    const slug = slugify(toEnglish);

    aElement.innerHTML = title ;
    aElement.setAttribute('href','/chat/' +slug+ '/');

    liElement.appendChild(aElement)
    ulElement.insertBefore(liElement, ulElement.firstChild);

    return {
        'slug': slug,
    }
}