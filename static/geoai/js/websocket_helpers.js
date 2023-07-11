// Grab the while QA container.
const chatQaContent = document.querySelector('.chat-qa-content')
let answerID;

// Automaticaly scroll down after each question.
const scrollBottom = () => {
    const element = document.querySelector('.chat-qa-content');
    element.scrollTo({top:element.scrollHeight, behaviour: 'smooth'});
}

let qaID;
// Generate random IDs.
const generateID = () => {
    // Generate a unique value for adding to ID
    const uv = Date.now().toString();
    qaID = 'qa' + uv;
    return qaID;
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
    answerWrapper.classList.add('a-block', 'skeleton-loading');
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


// Grab button.
const getButton = (btn) => {
    const button = document.querySelector(btn);          
    return button;
}


// Disable button.
function disableButton(attr){
    const button = getButton(attr);
    button.disabled = true;
    button.classList.add('disabled-btn');
}


// Enable button.
const enableButton = (attr) => {
    const button = getButton(attr);
    button.disabled = false;
    button.classList.remove('disabled-btn');
}

// Remove loading effect as soon as the response was received.
function removeLoading() {
    const elm = document.querySelector(`#${qaID} > .a-block`);
    elm.classList.remove('skeleton-loading');
}

const addTopicTitle = (title) => {
    const ulElement = document.querySelector('.chat-history-links ul')

    const liElement = document.createElement('li');
    const aElement = document.createElement('a');

    const slugify = new Slugify();
    const slug = slugify.slug(title);

    aElement.innerHTML = `${title} ...` ;
    aElement.setAttribute('href', '/chat/' + slug + '/');

    liElement.appendChild(aElement)
    ulElement.insertBefore(liElement, ulElement.firstChild);

    return {
        'slug': slug,
    }
}

// Replace the ' ``` ' with a <code> and the \n with the <p>.
// const textFormat = (text) => {
//     let formattedText = text.split('\n').map(line => `<p>${line}</p>`).join('');
//     const codePrefix = `<code class="answer-code-block">`;
//     const codeSuffix = `</code>`;
//     let codetText = '';
//     let asigned = 0;
    
//     const splited = formattedText.split('</p>');
//     for(let i = 0; i < splited.length; i++) {
//         if(splited[i] == '<p>```'){
//             if(asigned == 0){
//                 splited[i] = codePrefix;
//             } else if(asigned == 1){
//                 splited[i] = codeSuffix;
//             }
//             asigned++;
//             if(asigned > 1){asigned=0}
//         }
//         codetText += `${splited[i]}</p>`;
//     }
//     return codetText;
// }