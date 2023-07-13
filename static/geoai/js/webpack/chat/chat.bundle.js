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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Slugify: () => (/* binding */ Slugify)\n/* harmony export */ });\n// This is a title's slugifyer class.\n// It checks it the letter in the title is Georgian,\n// If yes, it converts to Georgian letter and, \n// finally sluglifyes the final string.\nclass Slugify {\n    constructor() {\n        this.chars = {\n            'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v',\n            'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm',\n            'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's',\n            'უ': 'u', 'ფ': 'f', 'ქ': 'q', 'ღ': 'gh', 'ყ': 'k', 'შ': 'sh',\n            'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh',\n            'ჯ': 'j', 'ჰ': 'h', ' ': ' '\n        }\n    }\n\n    _slugify(text) {\n        return text\n            .toString()         // Convert to a string\n            .toLowerCase()      // Convert the string to lower case\n            .trim()             // Remove spaces from the start and end of the string\n            .replace(/\\s+/g, '-')   // Replace spaces with -\n            .replace(/[^\\w\\-]+/g, '')   // Remove all non-word characters\n            .replace(/\\-\\-+/g, '-');  // Replace multiple - with single -\n    }\n\n    // Check if letter is Georgian.\n    _checkLetter(letter) {\n        // Georgian letter's RegExp patter.\n        const georgianPattern = /[\\u10A0-\\u10FF]/;\n\n        // Returns true if pattern matches, otherwise false.\n        return georgianPattern.test(letter);\n    }\n\n    \n    // Convert Georgian text to English.\n    _toEnglish(text) {\n        let result = '';\n        for (let i = 0; i < text.length; i++) {\n            // If the letter is Georgian and it is in chars dict. \n            if (this._checkLetter(text[i]) && text[i] in this.chars) {\n                result += this.chars[text[i]];\n            } else {\n                result += text[i];\n            } \n        }\n        return result;\n    }\n\n    slug(text) {\n        return text ? this._slugify(this._toEnglish(text)) : null;\n    }\n}\n\n//# sourceURL=webpack://geoai/./js/original/chat/slugify.js?");

/***/ }),

/***/ "./js/original/chat/topics.js":
/*!************************************!*\
  !*** ./js/original/chat/topics.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   APIClient: () => (/* binding */ APIClient)\n/* harmony export */ });\n/*\n    This script adds interection to the topic title's action buttons\n    such as Edit, Delete, Approve and close.\n*/\n\n// Grab wrapper element of action buttons\nconst actionWrapper = document.querySelectorAll('.act-wrapper');\nactionWrapper.forEach(element => {\n    // Grab action buttons container\n    const actBtnConfirm = element.querySelector('.act-btn-confirm');\n    // Set a mouseleave evente to action buttons container.\n    actBtnConfirm.addEventListener('mouseleave', function(e) {\n        this.classList.remove('display-act-btn-confirm');\n        this.querySelector('.confirm-msg').contentEditable = false;\n    });\n\n    element.addEventListener('click', function(e){\n        e.preventDefault();\n        // Dinamicaly import topicTitleActions module.\n        __webpack_require__.e(/*! import() | topicTitleActions */ \"topicTitleActions\").then(__webpack_require__.bind(__webpack_require__, /*! ./topicTitleActions */ \"./js/original/chat/topicTitleActions.js\"))\n            .then(({topicTitleActions}) => {\n                topicTitleActions(e);\n            });\n    });\n});\n\n\n// Get Cookies\nclass Cookie {\n    constructor(name) {\n        this.name = name;\n    }\n\n    _decodeCookie(cookie) {\n            return decodeURIComponent(cookie.split('=')[1]);\n    }\n\n    get(){\n        const cookieValue = document.cookie\n        .split('; ')\n        .find(raw => raw.startsWith(this.name + '='));\n        return cookieValue ? this._decodeCookie(cookieValue) : null;\n\n    }\n}\n\n// Deleting and updating topics.\nclass APIClient {\n    constructor(baseUrl){\n        this.baseUrl = baseUrl\n        this.cookie = new Cookie('csrftoken')\n        this.errorText = 'ვერ მოხერხდა მოთხოვნის შესრულება, გთხოვთ ცადოთ ახლიდან. ';\n    }\n\n\n    async _request(method, endpoint, data){\n        let response;\n\n        try {\n            response = await fetch(`${this.baseUrl}${endpoint}`,{\n                method: method,\n                headers: {\n                    'Content-type' : 'application/json',\n                    'x-CSRFToken': this.cookie.get(),\n                },\n                credentials: 'same-origin',\n                body: data ? JSON.stringify(data) : null\n            });\n        } catch (error) {\n            throw new Error(this.errorText + error)\n        }\n\n        if (!response.ok) {\n            throw new Error(this.errorText + response.statusText)\n        }\n\n        if (response.status != 204) {\n            return response.json();\n        } else {\n            return null;\n        } \n        \n    }\n\n    async update(endpoint, data) {\n        return this._request('PUT', endpoint, data)\n    }\n\n    async delete(endpoint) {\n        return this._request('DELETE', endpoint);\n    }\n}\n\n\n//# sourceURL=webpack://geoai/./js/original/chat/topics.js?");

/***/ }),

/***/ "./js/original/chat/websocket.js":
/*!***************************************!*\
  !*** ./js/original/chat/websocket.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createChatSocket: () => (/* binding */ createChatSocket)\n/* harmony export */ });\n/* harmony import */ var _websocket_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./websocket_helpers */ \"./js/original/chat/websocket_helpers.js\");\n\n\n// Generate a WebSocket URL.\nconst generateUrl = (slug) => {\n    if (slug == null) {\n        slug = '';\n    } else {\n        slug = slug + '/'\n    }\n    const url = 'ws://' + window.location.host + '/ws/chat/'+ slug\n    return url\n}\n\n// Instantiate the WebSocket.\nfunction createChatSocket(slug) {\n\n    const chatSocket = new WebSocket(generateUrl(slug));\n\n    chatSocket.onmessage = function (e) {\n        const data = JSON.parse(e.data);\n        //const formattedtText = textFormat(data.message);\n        document.querySelector('.answer_waiting_gif').style.display = 'none';\n        document.querySelector('#' + (0,_websocket_helpers__WEBPACK_IMPORTED_MODULE_0__.aID)()).innerHTML = (data.message + '\\n');\n\n        (0,_websocket_helpers__WEBPACK_IMPORTED_MODULE_0__.removeLoading)(); // Removie loading effect.\n        (0,_websocket_helpers__WEBPACK_IMPORTED_MODULE_0__.enableButton)('#chat-message-submit') // Enable submit button.\n    };\n\n\n    chatSocket.onclose = function (e) {\n        console.error('Chat socket closed unexpectedly');\n    };\n\n\n    document.querySelector('#chat-message-submit').onclick = function (e) {\n        // Dinamicaly import websocket_helpers module.\n        Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./websocket_helpers */ \"./js/original/chat/websocket_helpers.js\")).then(({\n            disableButton,\n            question,\n            addTopicTitle,\n            scrollBottom\n        }) => {\n            const messageInputDom = document.querySelector('#chat-message-input');\n            const message = messageInputDom.value;\n            disableButton('#chat-message-submit')\n            \n            question(message);\n            if (slug == null) {\n                slug = addTopicTitle(message.slice(0, 20)).slug;\n            }\n            scrollBottom();\n            \n            chatSocket.send(JSON.stringify({\n                'message': message,\n                'slug': slug,\n            }));\n            messageInputDom.value = '';\n        });\n    };\n\n\n    return chatSocket;\n}\n\n\n//# sourceURL=webpack://geoai/./js/original/chat/websocket.js?");

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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
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
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".bundle.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "geoai:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"chat": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkgeoai"] = self["webpackChunkgeoai"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
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