/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/original/chat/main.js":
/*!**********************************!*\
  !*** ./js/original/chat/main.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _websocket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./websocket */ \"./js/original/chat/websocket.js\");\n/* harmony import */ var _slugify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./slugify */ \"./js/original/chat/slugify.js\");\n/* harmony import */ var _topics__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./topics */ \"./js/original/chat/topics.js\");\n\n\n\n\n//  Get slug from {{ slug|json_script:'chat-name'}} in chag/index.html.\nlet slug = JSON.parse(document.getElementById('chat-name').textContent);\n(0,_websocket__WEBPACK_IMPORTED_MODULE_0__.createChatSocket)(slug) // Run websocket.\n\n// Testing.\nconst updated_title = 'da me მე და ალიკა'\n// const converted = convertToGeorgian(updated_title)\nconst slugify = new _slugify__WEBPACK_IMPORTED_MODULE_1__.Slugify();\nconst slugA = slugify.slug(updated_title)\nconst api = new _topics__WEBPACK_IMPORTED_MODULE_2__.APIClient('http://127.0.0.1:8000/api/')\nconst data = {\n    \"user\": \"http://127.0.0.1:8000/api/users/aleksandre.development@gmail.com\",\n    \"title\": updated_title,\n    \"slug\": slugA\n}\n\n// console.log(data)\n// const p = api.update('topics/30/', data)\n// console.log(p)\n\n//# sourceURL=webpack://geoai/./js/original/chat/main.js?");

/***/ }),

/***/ "./js/original/chat/slugify.js":
/*!*************************************!*\
  !*** ./js/original/chat/slugify.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Slugify: () => (/* binding */ Slugify)\n/* harmony export */ });\n// Checks if class has been already defined in global scope,\n// otherwise defines it.\n// !!! Doing so, helpes to use this class in other files\n// without throwing errors, that it has bean already declared !!!.\n// window.Slugify = window.Slugify || \nclass Slugify {\n    constructor() {\n        this.chars = {\n            'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v',\n            'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm',\n            'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's',\n            'უ': 'u', 'ფ': 'f', 'ქ': 'q', 'ღ': 'gh', 'ყ': 'k', 'შ': 'sh',\n            'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh',\n            'ჯ': 'j', 'ჰ': 'h', ' ': ' '\n        }\n    }\n\n    _slugify(text) {\n        return text\n            .toString()         // Convert to a string\n            .toLowerCase()      // Convert the string to lower case\n            .trim()             // Remove spaces from the start and end of the string\n            .replace(/\\s+/g, '-')   // Replace spaces with -\n            .replace(/[^\\w\\-]+/g, '')   // Remove all non-word characters\n            .replace(/\\-\\-+/g, '-');  // Replace multiple - with single -\n    }\n\n    // Check if letter is Georgian.\n    _checkLetter(letter) {\n        // Georgian letter's RegExp patter.\n        const georgianPattern = /[\\u10A0-\\u10FF]/;\n\n        // Returns true if pattern matches, otherwise false.\n        return georgianPattern.test(letter);\n    }\n\n    \n    // Convert Georgian text to English.\n    _toEnglish(text) {\n        let result = '';\n        for (let i = 0; i < text.length; i++) {\n            // If the letter is Georgian and it is in chars dict. \n            if (this._checkLetter(text[i]) && text[i] in this.chars) {\n                result += this.chars[text[i]];\n            } else {\n                result += text[i];\n            } \n        }\n        return result;\n    }\n\n    slug(text) {\n        return text ? this._slugify(this._toEnglish(text)) : null;\n    }\n}\n\n//# sourceURL=webpack://geoai/./js/original/chat/slugify.js?");

/***/ }),

/***/ "./js/original/chat/topics.js":
/*!************************************!*\
  !*** ./js/original/chat/topics.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   APIClient: () => (/* binding */ APIClient)\n/* harmony export */ });\n/*\n    This script adds interection to the topic title's action buttons\n    such as Edit, Delete, Approve and close.\n*/\n\n// Grab wrapper element of action buttons\nconst actionWrapper = document.querySelectorAll('.act-wrapper');\nactionWrapper.forEach(element => {\n    // Grab action buttons container\n    const actBtnConfirm = element.querySelector('.act-btn-confirm');\n    // Set a mouseleave evente to action buttons container.\n    actBtnConfirm.addEventListener('mouseleave', function(e) {\n        this.classList.remove('display-act-btn-confirm');\n        this.querySelector('.confirm-msg').contentEditable = false;\n    });\n\n    element.addEventListener('click', function(e){\n        e.preventDefault();\n        const target = e.target; // Get current element\n        const classNames = target.className.split(\" \"); // Grab current element's class attributes\n        const currentElm = classNames[classNames.length - 1]; // Current element's class name\n        // If action is deletion\n        if(currentElm == 'geoai-trash-icon'){\n            // Add alert text to deletion.\n            const actBtn = target.parentNode.nextElementSibling;\n            actBtn.querySelector('.confirm-msg').textContent = 'წავშალო?';\n\n            // Hide action buttons and open confirmation dialog box\n            target.parentNode.classList.add('hide-element'); // class='topic-title-act-btn'\n            const nextSibling = target.parentNode.nextElementSibling; // class='act-btn-confirm'\n            nextSibling.classList.add('display-act-btn-confirm'); // Display confirmation container\n        \n        // If action is closing current action\n        }else if (currentElm == 'geoai-x-icon'){\n            target.parentNode.classList.remove('display-act-btn-confirm'); // class='act-btn-confirm'\n            const prevSibling = target.parentNode.previousElementSibling; // class='topic-title-act-btn'\n            prevSibling.classList.remove('hide-element');\n        \n            // If action is editions of topic title\n        }else if(currentElm == 'geoai-edit-icon'){\n            // Topic title 'a' element\n            const topicTitle = target.parentNode.parentNode.previousElementSibling;    \n            const nextSibling = target.parentNode.nextElementSibling; // class='act-btn-confirm'\n            // Grab message element\n            const actMsg = nextSibling.querySelector(`p.confirm-msg`); // class='confirm-msg'\n            // Display action buttons\n            nextSibling.classList.add('display-act-btn-confirm');\n            // Add title content to action's message\n            actMsg.textContent = topicTitle.textContent.trim();\n            // Make editable message element\n            actMsg.contentEditable = true; // class='confirm-msg'\n            // Auto focus message element\n            actMsg.focus(); // class='confirm-msg'\n        }\n    });\n});\n\n\n// Get Cookies\nclass Cookie {\n    constructor(name) {\n        this.name = name;\n    }\n\n    _decodeCookie(cookie) {\n            return decodeURIComponent(cookie.split('=')[1]);\n    }\n\n    get(){\n        const cookieValue = document.cookie\n        .split('; ')\n        .find(raw => raw.startsWith(this.name + '='));\n        return cookieValue ? this._decodeCookie(cookieValue) : null;\n\n    }\n}\n\n// Deleting and updating topics.\nclass APIClient {\n    constructor(baseUrl){\n        this.baseUrl = baseUrl\n        this.cookie = new Cookie('csrftoken')\n        this.errorText = 'ვერ მოხერხდა მოთხოვნის შესრულება, გთხოვთ ცადოთ ახლიდან. ';\n    }\n\n\n    async _request(method, endpoint, data){\n        let response;\n\n        try {\n            response = await fetch(`${this.baseUrl}${endpoint}`,{\n                method: method,\n                headers: {\n                    'Content-type' : 'application/json',\n                    'x-CSRFToken': this.cookie.get(),\n                },\n                credentials: 'same-origin',\n                body: data ? JSON.stringify(data) : null\n            });\n        } catch (error) {\n            throw new Error(this.errorText + error)\n        }\n\n        if (!response.ok) {\n            throw new Error(this.errorText + response.statusText)\n        }\n\n        if (response.status != 204) {\n            return response.json();\n        } else {\n            return null;\n        } \n        \n    }\n\n    async update(endpoint, data) {\n        return this._request('PUT', endpoint, data)\n    }\n\n    async delete(endpoint) {\n        return this._request('DELETE', endpoint);\n    }\n}\n\n\n//# sourceURL=webpack://geoai/./js/original/chat/topics.js?");

/***/ }),

/***/ "./js/original/chat/websocket.js":
/*!***************************************!*\
  !*** ./js/original/chat/websocket.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createChatSocket: () => (/* binding */ createChatSocket)\n/* harmony export */ });\n/* harmony import */ var _websocket_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./websocket_helpers */ \"./js/original/chat/websocket_helpers.js\");\n\n\n// Generate a WebSocket URL.\nconst generateUrl = (slug) => {\n    if (slug == null) {\n        slug = '';\n    } else {\n        slug = slug + '/'\n    }\n    const url = 'ws://' + window.location.host + '/ws/chat/'+ slug\n    return url\n}\n\n// Instantiate the WebSocket.\nfunction createChatSocket(slug) {\n\n    const chatSocket = new WebSocket(generateUrl(slug));\n\n    chatSocket.onmessage = function (e) {\n        const data = JSON.parse(e.data);\n        //const formattedtText = textFormat(data.message);\n        document.querySelector('.answer_waiting_gif').style.display = 'none';\n        document.querySelector('#' + (0,_websocket_helpers__WEBPACK_IMPORTED_MODULE_0__.aID)()).innerHTML = (data.message + '\\n');\n\n        (0,_websocket_helpers__WEBPACK_IMPORTED_MODULE_0__.removeLoading)(); // Removie loading effect.\n        (0,_websocket_helpers__WEBPACK_IMPORTED_MODULE_0__.enableButton)('#chat-message-submit') // Enable submit button.\n    };\n\n\n    chatSocket.onclose = function (e) {\n        console.error('Chat socket closed unexpectedly');\n    };\n\n\n    document.querySelector('#chat-message-submit').onclick = function (e) {\n        const messageInputDom = document.querySelector('#chat-message-input');\n        const message = messageInputDom.value;\n        (0,_websocket_helpers__WEBPACK_IMPORTED_MODULE_0__.disableButton)('#chat-message-submit')\n        \n        ;(0,_websocket_helpers__WEBPACK_IMPORTED_MODULE_0__.question)(message);\n        if (slug == null) {\n            slug = (0,_websocket_helpers__WEBPACK_IMPORTED_MODULE_0__.addTopicTitle)(message.slice(0, 20)).slug;\n        }\n        (0,_websocket_helpers__WEBPACK_IMPORTED_MODULE_0__.scrollBottom)();\n        \n        chatSocket.send(JSON.stringify({\n            'message': message,\n            'slug': slug,\n        }));\n        messageInputDom.value = '';\n    };\n\n\n    return chatSocket;\n}\n\n\n//# sourceURL=webpack://geoai/./js/original/chat/websocket.js?");

/***/ }),

/***/ "./js/original/chat/websocket_helpers.js":
/*!***********************************************!*\
  !*** ./js/original/chat/websocket_helpers.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   aID: () => (/* binding */ aID),\n/* harmony export */   addTopicTitle: () => (/* binding */ addTopicTitle),\n/* harmony export */   disableButton: () => (/* binding */ disableButton),\n/* harmony export */   enableButton: () => (/* binding */ enableButton),\n/* harmony export */   question: () => (/* binding */ question),\n/* harmony export */   removeLoading: () => (/* binding */ removeLoading),\n/* harmony export */   scrollBottom: () => (/* binding */ scrollBottom)\n/* harmony export */ });\n/* harmony import */ var _slugify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./slugify */ \"./js/original/chat/slugify.js\");\n\n// Grab the while QA container.\nconst chatQaContent = document.querySelector('.chat-qa-content')\nlet answerID;\n\n// Automaticaly scroll down after each question.\nfunction scrollBottom(){\n    const element = document.querySelector('.chat-qa-content');\n    element.scrollTo({top:element.scrollHeight, behaviour: 'smooth'});\n}\n\nlet qaID;\n// Generate random IDs.\nconst generateID = () => {\n    // Generate a unique value for adding to ID\n    const uv = Date.now().toString();\n    qaID = 'qa' + uv;\n    return qaID;\n}\n\n// Create QA elements.\nconst createElements = (qaBlockID) => {\n\n    const qaBlock = document.createElement('div')\n    qaBlock.classList.add('qa-block');\n    qaBlock.id = qaBlockID;\n\n    const questionWrapper = document.createElement('div')\n    const questionParagraph = document.createElement('p')\n    questionWrapper.classList.add('q-block');\n    questionParagraph.classList.add('q-paragraph', 'b-block-content');\n    questionParagraph.id = 'q-block' + qaBlockID\n\n    const answerWrapper = document.createElement('div')\n    const answerParagraph = document.createElement('p')\n    answerWrapper.classList.add('a-block', 'skeleton-loading');\n    answerParagraph.classList.add('q-paragraph', 'b-block-content');\n    answerID = 'a' + qaBlockID;\n    answerParagraph.id = answerID;\n\n    // Loading gif.\n    const loading = document.createElement('img');\n    loading.classList.add('answer_waiting_gif'); \n    const loadingUrl = 'http://' + window.location.host + '/static/geoai/images/answer_waiting_gray.gif';\n    loading.setAttribute('src', loadingUrl);\n\n    questionWrapper.appendChild(questionParagraph)\n    answerParagraph.appendChild(loading);\n    answerWrapper.appendChild(answerParagraph)\n\n    qaBlock.appendChild(questionWrapper)\n    qaBlock.appendChild(answerWrapper)\n\n    chatQaContent.appendChild(qaBlock);\n\n    return {\n        'qaBlock': qaBlock,\n        'questionParagraph': questionParagraph,\n        'answerParagraph': answerParagraph\n    }\n}\n\nfunction aID() {\n    return answerID;\n}\n\nconst insertContent = (message, id) => {\n    const element = document.querySelector('#' + id);\n    element.innerHTML = message\n}\n\n\nfunction question(message) {\n    const qaBlockID = generateID();\n    const elements = createElements(qaBlockID);\n    insertContent(message, elements.questionParagraph.id);\n}\n\n\n// Grab button.\nconst getButton = (btn) => {\n    const button = document.querySelector(btn);          \n    return button;\n}\n\n\n// Disable button.\nfunction disableButton(attr){\n    const button = getButton(attr);\n    button.disabled = true;\n    button.classList.add('disabled-btn');\n}\n\n\n// Enable button.\nfunction enableButton(attr){\n    const button = getButton(attr);\n    button.disabled = false;\n    button.classList.remove('disabled-btn');\n}\n\n// Remove loading effect as soon as the response was received.\nfunction removeLoading() {\n    const elm = document.querySelector(`#${qaID} > .a-block`);\n    elm.classList.remove('skeleton-loading');\n}\n\nfunction addTopicTitle(title) {\n    const ulElement = document.querySelector('.chat-history-links ul')\n\n    const liElement = document.createElement('li');\n    const aElement = document.createElement('a');\n\n    const slugify = new _slugify__WEBPACK_IMPORTED_MODULE_0__.Slugify();\n    const slug = slugify.slug(title);\n\n    aElement.innerHTML = `${title} ...` ;\n    aElement.setAttribute('href', '/chat/' + slug + '/');\n\n    liElement.appendChild(aElement)\n    ulElement.insertBefore(liElement, ulElement.firstChild);\n\n    return {\n        'slug': slug,\n    }\n}\n\n// Replace the ' ``` ' with a <code> and the \\n with the <p>.\n// const textFormat = (text) => {\n//     let formattedText = text.split('\\n').map(line => `<p>${line}</p>`).join('');\n//     const codePrefix = `<code class=\"answer-code-block\">`;\n//     const codeSuffix = `</code>`;\n//     let codetText = '';\n//     let asigned = 0;\n    \n//     const splited = formattedText.split('</p>');\n//     for(let i = 0; i < splited.length; i++) {\n//         if(splited[i] == '<p>```'){\n//             if(asigned == 0){\n//                 splited[i] = codePrefix;\n//             } else if(asigned == 1){\n//                 splited[i] = codeSuffix;\n//             }\n//             asigned++;\n//             if(asigned > 1){asigned=0}\n//         }\n//         codetText += `${splited[i]}</p>`;\n//     }\n//     return codetText;\n// }\n\n//# sourceURL=webpack://geoai/./js/original/chat/websocket_helpers.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./js/original/chat/main.js");
/******/ 	
/******/ })()
;