/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/original/chat/apiClient.js":
/*!***************************************!*\
  !*** ./js/original/chat/apiClient.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   APIClient: () => (/* binding */ APIClient)\n/* harmony export */ });\n// Get Cookies\nclass Cookie {\n    constructor(name) {\n        this.name = name;\n    }\n\n    _decodeCookie(cookie) {\n            return decodeURIComponent(cookie.split('=')[1]);\n    }\n\n    get(){\n        const cookieValue = document.cookie\n        .split('; ')\n        .find(raw => raw.startsWith(this.name + '='));\n        return cookieValue ? this._decodeCookie(cookieValue) : null;\n\n    }\n}\n\n// Deleting and updating topics.\nclass APIClient {\n    constructor(baseUrl){\n        this.baseUrl = baseUrl\n        this.cookie = new Cookie('csrftoken')\n        this.errorText = 'ვერ მოხერხდა მოთხოვნის შესრულება, გთხოვთ ცადოთ ახლიდან. ';\n    }\n\n\n    async _request(method, endpoint, data){\n        let response;\n\n        try {\n            response = await fetch(`${this.baseUrl}${endpoint}`,{\n                method: method,\n                headers: {\n                    'Content-type' : 'application/json',\n                    'x-CSRFToken': this.cookie.get(),\n                },\n                credentials: 'same-origin',\n                body: data ? JSON.stringify(data) : null\n            });\n        } catch (error) {\n            throw new Error(this.errorText + error)\n        }\n\n        if (!response.ok) {\n            throw new Error(this.errorText + response.statusText)\n        }\n\n        if (response.status != 204) {\n            return response.json();\n        } else {\n            return null;\n        } \n        \n    }\n\n    async update(endpoint, data) {\n        return this._request('PUT', endpoint, data)\n    }\n\n    async delete(endpoint) {\n        return this._request('DELETE', endpoint);\n    }\n}\n\n//# sourceURL=webpack://geoai/./js/original/chat/apiClient.js?");

/***/ }),

/***/ "./js/original/chat/functions.js":
/*!***************************************!*\
  !*** ./js/original/chat/functions.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ActBtn: () => (/* binding */ ActBtn),\n/* harmony export */   ActionBtn: () => (/* binding */ ActionBtn),\n/* harmony export */   ActionBtnFunc: () => (/* binding */ ActionBtnFunc),\n/* harmony export */   TitleAction: () => (/* binding */ TitleAction)\n/* harmony export */ });\n/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utilities */ \"./js/original/chat/utilities.js\");\n\n\nlet loader = new _utilities__WEBPACK_IMPORTED_MODULE_0__.ModuleLoader([\n    { module: 'mixins', func: 'Target' },\n    { module: 'functions', func: 'ActionBtnFunc'},\n]);\n\n\n// Functions used acrose the application.\nclass ActBtn {\n    static hide(e) { \n        const elm = e.target;\n        elm.classList.remove('display-act-btn-confirm');\n        elm.querySelector('.confirm-msg').contentEditable = false;\n    }\n};\n\n\n// Define actions (edit, delete) to topic titles. \nclass TitleAction {\n    static define(e) {\n        e.preventDefault();\n        try {\n            new ActionBtn(e);\n        } catch (error) { \n            throw new Error(error.message);\n        }\n    }\n}\n\n// This is a class for handling actions such as: delete, edit of\n// the titles in the chat sidebar.\nclass ActionBtnFunc {\n    constructor(elm) {\n        this.elm = elm;\n    }\n\n    get delete() {\n        this.elm.setContent(this.elm.nextSibling, '.confirm-msg', 'წავშალო?'); // Confirmation text.\n        this.elm.parent.classList.add('hide-element'); // Hide the class='topic-title-act-btn'\n        this.elm.nextSibling.classList.add('display-act-btn-confirm'); // Display confirmation container\n    }\n\n    get close() {\n        this.elm.parent.classList.remove('display-act-btn-confirm'); // ---> class='act-btn-confirm'\n        this.elm.prevSibling.classList.remove('hide-element');\n    }\n\n    get edit() {\n        const actMsg = this.elm.nextSibling.querySelector(`p.confirm-msg`);\n        this.elm.nextSibling.classList.add('display-act-btn-confirm'); // Display action buttons.\n        actMsg.textContent = this.elm.topicTitle.textContent.trim(); // Add confirmation message.\n        actMsg.contentEditable = true; // class='confirm-msg'\n        actMsg.focus(); // class='confirm-msg'\n    }\n}\n\nclass ActionBtn {\n    constructor(e) {\n        this.e = e;\n        this.init();\n        this.prevAction;\n    }\n\n    async init() {\n        try {\n            const mixins = await loader.load(['Target', 'ActionBtnFunc']);\n            this.elm = new mixins.Target(this.e);\n            this.curClasse = this.elm.curClasse(1);\n            this.action = new mixins.ActionBtnFunc(this.elm);\n            \n            this.handleAction();\n        } catch (error) {\n            throw new Error(`Something went wrong. ${error.message}`);\n        }\n    }\n\n    handleAction() {\n        switch (this.curClasse) {\n            case 'geoai-trash-icon':\n                this.prevAction = 'delete'\n                this.action.delete;\n                break;\n            case 'geoai-x-icon':\n                this.action.close;\n                break;\n            case 'geoai-edit-icon':\n                this.prevAction = 'edit'\n                this.action.edit;\n                break;\n            default:\n                this.action.close;\n                break;\n        }\n    }\n}\n\n\n\n\n//# sourceURL=webpack://geoai/./js/original/chat/functions.js?");

/***/ }),

/***/ "./js/original/chat/main.js":
/*!**********************************!*\
  !*** ./js/original/chat/main.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _websocket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./websocket */ \"./js/original/chat/websocket.js\");\n/* harmony import */ var _sidebar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sidebar */ \"./js/original/chat/sidebar.js\");\n\n\n\n//  Get slug from {{ slug|json_script:'chat-name'}} in chag/index.html.\nlet slug = JSON.parse(document.getElementById('chat-name').textContent);\n(0,_websocket__WEBPACK_IMPORTED_MODULE_0__.createChatSocket)(slug) // Run websocket.\n\n\n// Testing.\n\n\n\n\n\n// const approveElms = document.querySelectorAll('.geoai-check-icon');\n// approveElms.forEach(approve => {\n//     approve.addEventListener('click', (e) => {\n//         e.preventDefault();\n//         console.log('Approved')\n//     });\n// });\n\n\n\n\n// const updated_title = 'da me მე და ალიკა'\n// const converted = convertToGeorgian(updated_title)\n// const slugify = new Slugify();\n// const slugA = slugify.slug(updated_title)\n\n// const data = {\n//     \"user\": \"http://127.0.0.1:8000/api/users/aleksandre.development@gmail.com\",\n//     \"title\": updated_title,\n//     \"slug\": slugA\n// }\n\n\n\n// console.log(data)\n// const p = api.update('topics/30/', data)\n// console.log(p)\n\n//# sourceURL=webpack://geoai/./js/original/chat/main.js?");

/***/ }),

/***/ "./js/original/chat/mixins.js":
/*!************************************!*\
  !*** ./js/original/chat/mixins.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Chars: () => (/* binding */ Chars),\n/* harmony export */   CheckLetter: () => (/* binding */ CheckLetter),\n/* harmony export */   Convert: () => (/* binding */ Convert),\n/* harmony export */   CurrentAction: () => (/* binding */ CurrentAction),\n/* harmony export */   Element: () => (/* binding */ Element),\n/* harmony export */   GrabElements: () => (/* binding */ GrabElements),\n/* harmony export */   GrabID: () => (/* binding */ GrabID),\n/* harmony export */   SetEvent: () => (/* binding */ SetEvent),\n/* harmony export */   Slug: () => (/* binding */ Slug),\n/* harmony export */   Target: () => (/* binding */ Target)\n/* harmony export */ });\nclass GrabElements {\n    static from(attr) {\n        return Array.from(document.querySelectorAll(attr));\n    }\n}\n\n\nclass SetEvent {\n    static to(element, event, func) {\n        element.forEach(elm => {\n            elm.addEventListener(event, func);\n        });\n    }\n}\n\n\nclass Target {\n    constructor(e) {\n        this.e = e;\n    }\n    \n    get classes() {\n        return this.e.target.className.split(\" \");\n    }\n\n    // Grabs the element from the right.\n    curClasse(nth) {\n        return this.classes[this.classes.length - nth];\n    }\n\n    get target() {\n        return this.e.target;\n    }\n\n    get parent() {\n        return this.target.parentNode;\n    }\n\n    get nextSibling() {\n        return this.parent.nextElementSibling;\n    }\n\n    get prevSibling() {\n        return this.parent.previousElementSibling;\n    }\n\n    get topicTitle() {\n        return this.parent.parentNode.previousElementSibling;\n    }\n\n    setContent(elm, attr, text) {\n        elm.querySelector(attr).textContent = text;\n    }\n\n    static id(e) {\n        return e.target.id;\n    }\n\n}\n\n\n\nclass GrabID {\n    static from(e) {\n        return e.target.id;\n    }\n}\n\n\nclass CurrentAction {\n    static get(act) {\n        return act;\n    }\n}\n\n\nclass Chars {\n    static get geoEng() {\n        return {\n            'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v',\n            'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm',\n            'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's',\n            'უ': 'u', 'ფ': 'f', 'ქ': 'q', 'ღ': 'gh', 'ყ': 'k', 'შ': 'sh',\n            'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh',\n            'ჯ': 'j', 'ჰ': 'h', ' ': ' '\n        }\n    }\n}\n\n\nclass Slug {\n    static get(text){\n        return text\n            .toString()         // Convert to a string\n            .toLowerCase()      // Convert the string to lower case\n            .trim()             // Remove spaces from the start and end of the string\n            .replace(/\\s+/g, '-')   // Replace spaces with -\n            .replace(/[^\\w\\-]+/g, '')   // Remove all non-word characters\n            .replace(/\\-\\-+/g, '-');  // Replace multiple - with single -\n    }\n}\n\n\nclass CheckLetter {\n    static ifGeo(letter) {\n        // Georgian letter's RegExp patter.\n        const georgianPattern = /[\\u10A0-\\u10FF]/;\n\n        // Returns true if pattern matches, otherwise false.\n        return georgianPattern.test(letter);\n    }\n}\n\n\nclass Convert {\n    static toEng(text) {\n        let result = '';\n        for (let i = 0; i < text.length; i++) {\n            // If the letter is Georgian and it is in chars dict. \n            if (CheckLetter.ifGeo(text[i]) && text[i] in Chars.geoEng) {\n                result += Chars.geoEng[text[i]];\n            } else {\n                result += text[i];\n            } \n        }\n        return result;\n    }\n}\n\n\nclass Element {\n    static setup(attr, event, func) {\n        const element = GrabElements.from(attr);\n        SetEvent.to(element, event, func);\n    }\n}\n\n\n\n\n\n//# sourceURL=webpack://geoai/./js/original/chat/mixins.js?");

/***/ }),

/***/ "./js/original/chat/sidebar.js":
/*!*************************************!*\
  !*** ./js/original/chat/sidebar.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _mixins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mixins */ \"./js/original/chat/mixins.js\");\n/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utilities */ \"./js/original/chat/utilities.js\");\n/* harmony import */ var _apiClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./apiClient */ \"./js/original/chat/apiClient.js\");\n/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./functions */ \"./js/original/chat/functions.js\");\n/*\n    This script adds interection to the topic title's action buttons\n    such as Edit, Delete, Approve and close.\n*/\n\n\n\n\n\nlet loader = new _utilities__WEBPACK_IMPORTED_MODULE_1__.ModuleLoader([\n    { module: 'mixins', func: 'Target' },\n    { module: 'utilities', func: 'Slugify' },\n    { module: 'mixins', func: 'CurrentAction' },\n    // { module: 'topicTitleActions', func: 'topicTitleActions' },\n]);\n\n\nlet actionWrapper = _mixins__WEBPACK_IMPORTED_MODULE_0__.GrabElements.from('.act-wrapper');\nactionWrapper.forEach(element => {\n    const actBtnConfirm = _mixins__WEBPACK_IMPORTED_MODULE_0__.GrabElements.from('.act-btn-confirm')\n    _mixins__WEBPACK_IMPORTED_MODULE_0__.SetEvent.to(actBtnConfirm, 'mouseleave', _functions__WEBPACK_IMPORTED_MODULE_3__.ActBtn.hide);\n    _mixins__WEBPACK_IMPORTED_MODULE_0__.SetEvent.to([element], 'click', _functions__WEBPACK_IMPORTED_MODULE_3__.TitleAction.define);\n});\n\n\n\n// Testing \n\n\n\nfunction testFunc(e) {\n    e.preventDefault();\n    try {\n        loader.load(['Slugify', 'Target', 'CurrentAction']).then(mixins => {\n            const url = 'http://' + window.location.host + '/api/';\n            const id = mixins.Target.id(e);\n            console.log(id)\n            const endPoint = `topics/${id}/`;\n\n            const updated_title = 'da me vashaaaa'\n            // const slugify = mixins.Slugify();\n            const slugA = mixins.Slugify.result(updated_title)\n            const data = {\n                \"user\": \"http://127.0.0.1:8000/api/users/aleksandre.development@gmail.com\",\n                \"title\": updated_title,\n                \"slug\": slugA\n            }\n\n            const api = new _apiClient__WEBPACK_IMPORTED_MODULE_2__.APIClient(url)\n            const current = mixins.CurrentAction.get('update'); // Testing\n            console.log(current)\n            if (current == 'delete') {\n                console.log(endPoint);\n                api.delete(endPoint)\n            } else if (current == 'update') {\n                if (data) {\n                    console.log('data')\n                    api.update(endPoint, data)\n                }\n            }\n            console.log(url);\n        });\n    } catch (error) {\n       throw new Error(`Failed to load module: f${error.message}`);\n    }\n    \n}\n\n_mixins__WEBPACK_IMPORTED_MODULE_0__.Element.setup('.geoai-check-icon', 'click', testFunc);\n\n// // Get Cookies\n// class Cookie {\n//     constructor(name) {\n//         this.name = name;\n//     }\n\n//     _decodeCookie(cookie) {\n//             return decodeURIComponent(cookie.split('=')[1]);\n//     }\n\n//     get(){\n//         const cookieValue = document.cookie\n//         .split('; ')\n//         .find(raw => raw.startsWith(this.name + '='));\n//         return cookieValue ? this._decodeCookie(cookieValue) : null;\n\n//     }\n// }\n\n// // Deleting and updating topics.\n// export class APIClient {\n//     constructor(baseUrl){\n//         this.baseUrl = baseUrl\n//         this.cookie = new Cookie('csrftoken')\n//         this.errorText = 'ვერ მოხერხდა მოთხოვნის შესრულება, გთხოვთ ცადოთ ახლიდან. ';\n//     }\n\n\n//     async _request(method, endpoint, data){\n//         let response;\n\n//         try {\n//             response = await fetch(`${this.baseUrl}${endpoint}`,{\n//                 method: method,\n//                 headers: {\n//                     'Content-type' : 'application/json',\n//                     'x-CSRFToken': this.cookie.get(),\n//                 },\n//                 credentials: 'same-origin',\n//                 body: data ? JSON.stringify(data) : null\n//             });\n//         } catch (error) {\n//             throw new Error(this.errorText + error)\n//         }\n\n//         if (!response.ok) {\n//             throw new Error(this.errorText + response.statusText)\n//         }\n\n//         if (response.status != 204) {\n//             return response.json();\n//         } else {\n//             return null;\n//         } \n        \n//     }\n\n//     async update(endpoint, data) {\n//         return this._request('PUT', endpoint, data)\n//     }\n\n//     async delete(endpoint) {\n//         return this._request('DELETE', endpoint);\n//     }\n// }\n\n\n//# sourceURL=webpack://geoai/./js/original/chat/sidebar.js?");

/***/ }),

/***/ "./js/original/chat/utilities.js":
/*!***************************************!*\
  !*** ./js/original/chat/utilities.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ModuleLoader: () => (/* binding */ ModuleLoader),\n/* harmony export */   Slugify: () => (/* binding */ Slugify),\n/* harmony export */   Unique: () => (/* binding */ Unique)\n/* harmony export */ });\n/* harmony import */ var _mixins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mixins */ \"./js/original/chat/mixins.js\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid */ \"./node_modules/uuid/dist/esm-browser/v4.js\");\n\n\n\n\nclass Unique {\n    static get ID() {\n        return (0,uuid__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    }\n}\n\nclass Slugify {\n    static result(text) {\n        return text ? _mixins__WEBPACK_IMPORTED_MODULE_0__.Slug.get(_mixins__WEBPACK_IMPORTED_MODULE_0__.Convert.toEng(text)) : null;\n    }\n}\n\n\nclass ModuleLoader{\n    constructor(modules) {\n        // obj.reduce(accumulator, currentValue, currentIndex, sourceArray) => {}\n        this.modules = modules.reduce((obj, module) => {\n            console.log(module)\n            obj[module.func] = module;\n            return obj;\n        }, {});\n    }\n\n    async load(moduleName) {\n        let combinedModules = {}\n        const imports = moduleName.map(async (moduleName) => {\n            const {module, func} = this.modules[moduleName];\n            return __webpack_require__(\"./js/original/chat lazy recursive ^\\\\.\\\\/.*$\")(`./${module}`)\n                .then(moduleObj => {\n                    if (moduleObj[func]) {\n                        combinedModules[func] = moduleObj[func];\n                    } else {\n                        throw new Error(`Module ${module} does not export a function ${func}.`);\n                    }\n                });\n        });\n        return Promise.all(imports).then(() => combinedModules);\n    }\n}\n\n//# sourceURL=webpack://geoai/./js/original/chat/utilities.js?");

/***/ }),

/***/ "./js/original/chat/websocket.js":
/*!***************************************!*\
  !*** ./js/original/chat/websocket.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createChatSocket: () => (/* binding */ createChatSocket)\n/* harmony export */ });\n/* harmony import */ var _websocketHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./websocketHelpers */ \"./js/original/chat/websocketHelpers.js\");\n\n\n// Generate a WebSocket URL.\nconst generateUrl = (slug) => {\n    if (slug == null) {\n        slug = '';\n    } else {\n        slug = slug + '/'\n    }\n    const url = 'ws://' + window.location.host + '/ws/chat/'+ slug\n    return url\n}\n\n// Instantiate the WebSocket.\nfunction createChatSocket(slug) {\n\n    const chatSocket = new WebSocket(generateUrl(slug));\n\n    chatSocket.onmessage = function (e) {\n        const data = JSON.parse(e.data);\n        //const formattedtText = textFormat(data.message);\n        document.querySelector('.answer_waiting_gif').style.display = 'none';\n        document.querySelector('#' + (0,_websocketHelpers__WEBPACK_IMPORTED_MODULE_0__.aID)()).innerHTML = (data.message + '\\n');\n\n        (0,_websocketHelpers__WEBPACK_IMPORTED_MODULE_0__.removeLoading)(); // Removie loading effect.\n        (0,_websocketHelpers__WEBPACK_IMPORTED_MODULE_0__.enableButton)('#chat-message-submit') // Enable submit button.\n    };\n\n\n    chatSocket.onclose = function (e) {\n        console.error('Chat socket closed unexpectedly');\n    };\n\n\n    document.querySelector('#chat-message-submit').onclick = function (e) {\n        // Dinamicaly import websocket_helpers module.\n        Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./websocketHelpers */ \"./js/original/chat/websocketHelpers.js\")).then(({\n            disableButton,\n            question,\n            addTopicTitle,\n            scrollBottom\n        }) => {\n            const messageInputDom = document.querySelector('#chat-message-input');\n            const message = messageInputDom.value;\n            disableButton('#chat-message-submit')\n            \n            question(message);\n            if (slug == null) {\n                slug = addTopicTitle(message.slice(0, 20)).slug;\n            }\n            scrollBottom();\n            \n            chatSocket.send(JSON.stringify({\n                'message': message,\n                'slug': slug,\n            }));\n            messageInputDom.value = '';\n        });\n    };\n\n\n    return chatSocket;\n}\n\n\n//# sourceURL=webpack://geoai/./js/original/chat/websocket.js?");

/***/ }),

/***/ "./js/original/chat/websocketHelpers.js":
/*!**********************************************!*\
  !*** ./js/original/chat/websocketHelpers.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   aID: () => (/* binding */ aID),\n/* harmony export */   addTopicTitle: () => (/* binding */ addTopicTitle),\n/* harmony export */   disableButton: () => (/* binding */ disableButton),\n/* harmony export */   enableButton: () => (/* binding */ enableButton),\n/* harmony export */   question: () => (/* binding */ question),\n/* harmony export */   removeLoading: () => (/* binding */ removeLoading),\n/* harmony export */   scrollBottom: () => (/* binding */ scrollBottom)\n/* harmony export */ });\n/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utilities */ \"./js/original/chat/utilities.js\");\n\n\n// Grab the while QA container.\nconst chatQaContent = document.querySelector('.chat-qa-content')\nlet answerID;\n\n// Automaticaly scroll down after each question.\nfunction scrollBottom(){\n    const element = document.querySelector('.chat-qa-content');\n    element.scrollTo({top:element.scrollHeight, behaviour: 'smooth'});\n}\n\nlet qaID;\n// Generate random IDs.\nconst generateID = () => {\n    // Generate a unique value for adding to ID\n    const uv = Date.now().toString();\n    qaID = 'qa' + uv;\n    return qaID;\n}\n\n// Create QA elements.\nconst createElements = (qaBlockID) => {\n\n    const qaBlock = document.createElement('div')\n    qaBlock.classList.add('qa-block');\n    qaBlock.id = qaBlockID;\n\n    const questionWrapper = document.createElement('div')\n    const questionParagraph = document.createElement('p')\n    questionWrapper.classList.add('q-block');\n    questionParagraph.classList.add('q-paragraph', 'b-block-content');\n    questionParagraph.id = 'q-block' + qaBlockID\n\n    const answerWrapper = document.createElement('div')\n    const answerParagraph = document.createElement('p')\n    answerWrapper.classList.add('a-block', 'skeleton-loading');\n    answerParagraph.classList.add('q-paragraph', 'b-block-content');\n    answerID = 'a' + qaBlockID;\n    answerParagraph.id = answerID;\n\n    // Loading gif.\n    const loading = document.createElement('img');\n    loading.classList.add('answer_waiting_gif'); \n    const loadingUrl = 'http://' + window.location.host + '/static/geoai/images/answer_waiting_gray.gif';\n    loading.setAttribute('src', loadingUrl);\n\n    questionWrapper.appendChild(questionParagraph)\n    answerParagraph.appendChild(loading);\n    answerWrapper.appendChild(answerParagraph)\n\n    qaBlock.appendChild(questionWrapper)\n    qaBlock.appendChild(answerWrapper)\n\n    chatQaContent.appendChild(qaBlock);\n\n    return {\n        'qaBlock': qaBlock,\n        'questionParagraph': questionParagraph,\n        'answerParagraph': answerParagraph\n    }\n}\n\nfunction aID() {\n    return answerID;\n}\n\nconst insertContent = (message, id) => {\n    const element = document.querySelector('#' + id);\n    element.innerHTML = message\n}\n\n\nfunction question(message) {\n    const qaBlockID = generateID();\n    const elements = createElements(qaBlockID);\n    insertContent(message, elements.questionParagraph.id);\n}\n\n\n// Grab button.\nconst getButton = (btn) => {\n    const button = document.querySelector(btn);          \n    return button;\n}\n\n\n// Disable button.\nfunction disableButton(attr){\n    const button = getButton(attr);\n    button.disabled = true;\n    button.classList.add('disabled-btn');\n}\n\n\n// Enable button.\nfunction enableButton(attr){\n    const button = getButton(attr);\n    button.disabled = false;\n    button.classList.remove('disabled-btn');\n}\n\n// Remove loading effect as soon as the response was received.\nfunction removeLoading() {\n    const elm = document.querySelector(`#${qaID} > .a-block`);\n    elm.classList.remove('skeleton-loading');\n}\n\nfunction addTopicTitle(title) {\n    const ulElement = document.querySelector('.chat-history-links ul')\n\n    const liElement = document.createElement('li');\n    const aElement = document.createElement('a');\n\n    // const slugify = new Slugify();\n    // const slug = slugify.slug(title);\n    const slug = _utilities__WEBPACK_IMPORTED_MODULE_0__.Slugify.result(title);\n\n    aElement.innerHTML = `${title} ...` ;\n    aElement.setAttribute('href', '/chat/' + slug + '/');\n\n    liElement.appendChild(aElement)\n    ulElement.insertBefore(liElement, ulElement.firstChild);\n\n    return {\n        'slug': slug,\n    }\n}\n\n// Replace the ' ``` ' with a <code> and the \\n with the <p>.\n// const textFormat = (text) => {\n//     let formattedText = text.split('\\n').map(line => `<p>${line}</p>`).join('');\n//     const codePrefix = `<code class=\"answer-code-block\">`;\n//     const codeSuffix = `</code>`;\n//     let codetText = '';\n//     let asigned = 0;\n    \n//     const splited = formattedText.split('</p>');\n//     for(let i = 0; i < splited.length; i++) {\n//         if(splited[i] == '<p>```'){\n//             if(asigned == 0){\n//                 splited[i] = codePrefix;\n//             } else if(asigned == 1){\n//                 splited[i] = codeSuffix;\n//             }\n//             asigned++;\n//             if(asigned > 1){asigned=0}\n//         }\n//         codetText += `${splited[i]}</p>`;\n//     }\n//     return codetText;\n// }\n\n//# sourceURL=webpack://geoai/./js/original/chat/websocketHelpers.js?");

/***/ }),

/***/ "./js/original/chat lazy recursive ^\\.\\/.*$":
/*!*******************************************************************************!*\
  !*** ./js/original/chat/ lazy ^\.\/.*$ chunkName: [request] namespace object ***!
  \*******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var map = {\n\t\"./_topicTitleActions\": [\n\t\t\"./js/original/chat/_topicTitleActions.js\",\n\t\t7,\n\t\t\"_topicTitleActions\"\n\t],\n\t\"./_topicTitleActions.js\": [\n\t\t\"./js/original/chat/_topicTitleActions.js\",\n\t\t7,\n\t\t\"_topicTitleActions\"\n\t],\n\t\"./apiClient\": [\n\t\t\"./js/original/chat/apiClient.js\",\n\t\t9\n\t],\n\t\"./apiClient.js\": [\n\t\t\"./js/original/chat/apiClient.js\",\n\t\t9\n\t],\n\t\"./functions\": [\n\t\t\"./js/original/chat/functions.js\",\n\t\t9\n\t],\n\t\"./functions.js\": [\n\t\t\"./js/original/chat/functions.js\",\n\t\t9\n\t],\n\t\"./main\": [\n\t\t\"./js/original/chat/main.js\",\n\t\t9\n\t],\n\t\"./main.js\": [\n\t\t\"./js/original/chat/main.js\",\n\t\t9\n\t],\n\t\"./mixins\": [\n\t\t\"./js/original/chat/mixins.js\",\n\t\t9\n\t],\n\t\"./mixins.js\": [\n\t\t\"./js/original/chat/mixins.js\",\n\t\t9\n\t],\n\t\"./sidebar\": [\n\t\t\"./js/original/chat/sidebar.js\",\n\t\t9\n\t],\n\t\"./sidebar.js\": [\n\t\t\"./js/original/chat/sidebar.js\",\n\t\t9\n\t],\n\t\"./utilities\": [\n\t\t\"./js/original/chat/utilities.js\",\n\t\t9\n\t],\n\t\"./utilities.js\": [\n\t\t\"./js/original/chat/utilities.js\",\n\t\t9\n\t],\n\t\"./websocket\": [\n\t\t\"./js/original/chat/websocket.js\",\n\t\t9\n\t],\n\t\"./websocket.js\": [\n\t\t\"./js/original/chat/websocket.js\",\n\t\t9\n\t],\n\t\"./websocketHelpers\": [\n\t\t\"./js/original/chat/websocketHelpers.js\",\n\t\t9\n\t],\n\t\"./websocketHelpers.js\": [\n\t\t\"./js/original/chat/websocketHelpers.js\",\n\t\t9\n\t]\n};\nfunction webpackAsyncContext(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\treturn Promise.resolve().then(() => {\n\t\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\t\te.code = 'MODULE_NOT_FOUND';\n\t\t\tthrow e;\n\t\t});\n\t}\n\n\tvar ids = map[req], id = ids[0];\n\treturn Promise.all(ids.slice(2).map(__webpack_require__.e)).then(() => {\n\t\treturn __webpack_require__.t(id, ids[1] | 16)\n\t});\n}\nwebpackAsyncContext.keys = () => (Object.keys(map));\nwebpackAsyncContext.id = \"./js/original/chat lazy recursive ^\\\\.\\\\/.*$\";\nmodule.exports = webpackAsyncContext;\n\n//# sourceURL=webpack://geoai/./js/original/chat/_lazy_^\\.\\/.*$_chunkName:_%5Brequest%5D_namespace_object?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/native.js":
/*!******************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/native.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  randomUUID\n});\n\n//# sourceURL=webpack://geoai/./node_modules/uuid/dist/esm-browser/native.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);\n\n//# sourceURL=webpack://geoai/./node_modules/uuid/dist/esm-browser/regex.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ rng)\n/* harmony export */ });\n// Unique ID creation requires a high quality random # generator. In the browser we therefore\n// require the crypto API and do not support built-in fallback to lower quality random number\n// generators (like Math.random()).\nlet getRandomValues;\nconst rnds8 = new Uint8Array(16);\nfunction rng() {\n  // lazy load so that environments that need to polyfill have a chance to do so\n  if (!getRandomValues) {\n    // getRandomValues needs to be invoked in a context where \"this\" is a Crypto implementation.\n    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);\n\n    if (!getRandomValues) {\n      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');\n    }\n  }\n\n  return getRandomValues(rnds8);\n}\n\n//# sourceURL=webpack://geoai/./node_modules/uuid/dist/esm-browser/rng.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   unsafeStringify: () => (/* binding */ unsafeStringify)\n/* harmony export */ });\n/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ \"./node_modules/uuid/dist/esm-browser/validate.js\");\n\n/**\n * Convert array of 16 byte values to UUID string format of the form:\n * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\n */\n\nconst byteToHex = [];\n\nfor (let i = 0; i < 256; ++i) {\n  byteToHex.push((i + 0x100).toString(16).slice(1));\n}\n\nfunction unsafeStringify(arr, offset = 0) {\n  // Note: Be careful editing this code!  It's been tuned for performance\n  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434\n  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();\n}\n\nfunction stringify(arr, offset = 0) {\n  const uuid = unsafeStringify(arr, offset); // Consistency check for valid UUID.  If this throws, it's likely due to one\n  // of the following:\n  // - One or more input array values don't map to a hex octet (leading to\n  // \"undefined\" in the uuid)\n  // - Invalid input values for the RFC `version` or `variant` fields\n\n  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(uuid)) {\n    throw TypeError('Stringified UUID is invalid');\n  }\n\n  return uuid;\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);\n\n//# sourceURL=webpack://geoai/./node_modules/uuid/dist/esm-browser/stringify.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _native_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./native.js */ \"./node_modules/uuid/dist/esm-browser/native.js\");\n/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rng.js */ \"./node_modules/uuid/dist/esm-browser/rng.js\");\n/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stringify.js */ \"./node_modules/uuid/dist/esm-browser/stringify.js\");\n\n\n\n\nfunction v4(options, buf, offset) {\n  if (_native_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].randomUUID && !buf && !options) {\n    return _native_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].randomUUID();\n  }\n\n  options = options || {};\n  const rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`\n\n  rnds[6] = rnds[6] & 0x0f | 0x40;\n  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided\n\n  if (buf) {\n    offset = offset || 0;\n\n    for (let i = 0; i < 16; ++i) {\n      buf[offset + i] = rnds[i];\n    }\n\n    return buf;\n  }\n\n  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_2__.unsafeStringify)(rnds);\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);\n\n//# sourceURL=webpack://geoai/./node_modules/uuid/dist/esm-browser/v4.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ \"./node_modules/uuid/dist/esm-browser/regex.js\");\n\n\nfunction validate(uuid) {\n  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].test(uuid);\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);\n\n//# sourceURL=webpack://geoai/./node_modules/uuid/dist/esm-browser/validate.js?");

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
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./js/original/chat/main.js");
/******/ 	
/******/ })()
;