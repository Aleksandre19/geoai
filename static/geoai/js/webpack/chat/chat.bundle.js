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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   APIClient: () => (/* binding */ APIClient)\n/* harmony export */ });\n// Get Cookies\nclass Cookie {\n    constructor(name) {\n        this.name = name;\n    }\n\n    _decodeCookie(cookie) {\n            return decodeURIComponent(cookie.split('=')[1]);\n    }\n\n    get(){\n        const cookieValue = document.cookie\n        .split('; ')\n        .find(raw => raw.startsWith(this.name + '='));\n        return cookieValue ? this._decodeCookie(cookieValue) : null;\n\n    }\n}\n\n// Deleting and updating topics.\nclass APIClient {\n    constructor(baseUrl){\n        this.baseUrl = baseUrl\n        this.cookie = new Cookie('csrftoken')\n        this.errorText = 'ვერ მოხერხდა მოთხოვნის შესრულება, გთხოვთ ცადოთ ახლიდან. ';\n    }\n\n\n    async _request(method, endpoint, data){\n        let response;\n\n        try {\n            response = await fetch(`${this.baseUrl}${endpoint}`,{\n                method: method,\n                headers: {\n                    'Content-type' : 'application/json',\n                    'x-CSRFToken': this.cookie.get(),\n                },\n                credentials: 'same-origin',\n                body: data ? JSON.stringify(data) : null\n            });\n        } catch (error) {\n            throw new Error(this.errorText + error)\n        }\n\n        if (!response.ok)\n            throw new Error(this.errorText + response.statusText);\n        \n        if(response.ok) {\n            // console.log('success');\n            return response.ok;\n        }\n\n        if (response.status != 204) {\n            return response.json();\n        } else {\n            return null;\n        }\n        \n    }\n\n    async update(endpoint, data) {\n        return this._request('PUT', endpoint, data)\n    }\n\n    async delete(endpoint) {\n        return this._request('DELETE', endpoint);\n    }\n}\n\n//# sourceURL=webpack://geoai/./js/original/chat/apiClient.js?");

/***/ }),

/***/ "./js/original/chat/functions.js":
/*!***************************************!*\
  !*** ./js/original/chat/functions.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ActionBtn: () => (/* binding */ ActionBtn),\n/* harmony export */   TitleAction: () => (/* binding */ TitleAction),\n/* harmony export */   leaveActBtn: () => (/* binding */ leaveActBtn)\n/* harmony export */ });\n/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utilities */ \"./js/original/chat/utilities.js\");\n/* harmony import */ var _mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mixins */ \"./js/original/chat/mixins.js\");\n\n\nconst titleAct = new _mixins__WEBPACK_IMPORTED_MODULE_1__.Store();\nconst titleCont = new _mixins__WEBPACK_IMPORTED_MODULE_1__.Store();\n\nlet loader = new _utilities__WEBPACK_IMPORTED_MODULE_0__.ModuleLoader([\n    { module: 'mixins', func: 'Target' },\n    { module: 'apiClient', func: 'APIClient' },\n    { module: 'utilities', func: 'Slugify'},\n]);\n\n\n// Functions used acrose the application.\nclass leaveActBtn {\n    static hide(titleWrapper) {\n        titleWrapper.removeEventListener('click', _mixins__WEBPACK_IMPORTED_MODULE_1__.Prevent.click);\n        const wrapperID = titleWrapper.id.split('-')['1']; // <li id='li-{{topic.id}}'>\n        const titleElm = document.getElementById(`title-${wrapperID}`) // <a href=\"{% url 'topic' topic.slug %}\"...\n        titleElm.style.cursor = 'pointer';\n        // Replace confirmation message with original title's content if delete was triggered before.\n        const curActions = ['delete']; // Click on trash icon.\n        if (curActions.includes(titleAct.get))\n            titleElm.textContent = titleCont.get;\n            titleAct.clear;\n        \n        const actBtnElm = titleWrapper.querySelector('.act-btn-confirm');\n        const linkElm = titleWrapper.querySelector('.title-link');\n        actBtnElm.classList.remove('display-act-btn-confirm')\n        linkElm.blur();\n    }\n};\n\n\n// This class runes the function from the array.\nclass Func {\n    static execute(funcs, curClasse) {\n        funcs.forEach((actions) => {\n            if (!actions[curClasse]) return;\n\n            for (const action of actions[curClasse])\n                action();\n        });\n    }\n} \n\n\n// Define actions (edit, delete) to topic titles. \nclass TitleAction {\n    static define(e) {\n        e.preventDefault();\n        try {\n            new ActionBtn(e, titleAct);\n        } catch (error) { \n            throw new Error(error.message);\n        }\n    }\n}\n\n\nclass ActionBtn {\n    constructor(e, titleAct) {     \n        this.e = e; // Current button action event.\n        this.init();\n        this.titleAct = titleAct; // The action storage.\n    }\n\n    async init() {\n        try {\n            // Load necessary functions on event from mixins.js.\n            this.mixins = await loader.load(['Target', 'APIClient', 'Slugify']);\n\n            // Set up the required data.\n            this.elm = new this.mixins.Target(this.e); // Get element for the current event.\n            this.curClasse = this.elm.curClasse(1); // Get element's class attribute.\n \n            // Determine the classes from where a request is accepted.\n            const allowedClasses = [\n                'geoai-check-icon', 'geoai-trash-icon',\n                'geoai-x-icon', 'geoai-edit-icon'\n            ]\n\n            // Check if the request is allowed.\n            if (!allowedClasses.includes(this.curClasse))\n                return;\n            \n            // Front-end functionalitties for action buttons such as: `Edit`, `Delete`, `Close`.\n            this.action = new ActionBtnFunc(this.elm);\n\n            // Button action methods.\n            this.handleAction();\n\n        } catch (error) {\n            throw new Error(`Something went wrong. ${error.message}`);\n        }\n    }\n\n    confirm() {\n        // Check if the action is allowed.\n        const allowedActs = ['edit', 'delete'];\n        if (!allowedActs.includes(this.titleAct.get))\n            return;\n        \n        // Method which prepares everything before sending request to the API client.\n        const btnProcess = new BtnProcess(this.e, this.mixins);\n\n        const exacute = [ // Map the action types to their corresponding methods.\n            {'edit': [() => btnProcess.edition()]},\n            {'delete': [() => btnProcess.deletion()]},\n        ];\n\n        // Function executor.\n        Func.execute(exacute, this.titleAct.get);\n    }\n\n    // Prepare and execute button action methods.\n    handleAction() {\n        // Map the elements to their corresponding methods by class attribute.\n        const exacute = [ \n            {'geoai-check-icon': [() => this.confirm()]}, // Confirm.\n            {'geoai-trash-icon': [() => this.action.delete, () => this.titleAct.store('delete')]}, // Delete.\n            {'geoai-x-icon': [() => this.action.close]}, // Close.\n            {'geoai-edit-icon': [() => this.action.edit, () => this.titleAct.store('edit')]} // Edit.\n        ];\n\n        // Function executor.\n        Func.execute(exacute, this.curClasse);\n    }\n}\n\n// Prepare everything before sending a request to the API client.\nclass BtnProcess {\n    constructor(e, mixins) {\n        this.e = e; // class='geoai-check-icon'\n        this.id = mixins.Target.id(this.e);\n        this.titleBlock = document.getElementById(`li-${this.id}`);\n        this.curTitle = document.getElementById(`title-${this.id}`);\n        this.url = 'http://' + window.location.host + '/api/';\n        this.endPoint = `topics/${this.id}/`;\n        this.api = new mixins.APIClient(this.url); // API Client.\n        this.slug = mixins.Slugify.result(this.updatedTitle);\n        this.userID = document.getElementById('userID').textContent;      \n    }\n\n    get updatedTitle() {\n        return this.curTitle.textContent.trim().substring(0, 15);\n    }\n\n    get data() {\n        return {\n            \"user\": `${this.url}users/${this.userID}`,\n            \"title\": this.updatedTitle,\n            \"slug\": this.slug\n        };\n    }\n\n    get updateTitle() {\n        const addEllipsis = this.updatedTitle.length < 15\n            ? this.updatedTitle : this.updatedTitle + '...';\n        this.curTitle.textContent = addEllipsis;\n\n        // Toggling styles of action btn and confirm btn blocks.\n        this.e.target.parentNode.classList\n            .remove('display-act-btn-confirm'); // ---> class='act-btn-confirm'\n        this.e.target.parentNode.previousElementSibling\n            .classList.remove('hide-element'); // class='topic-title-act-btn'\n    }\n\n    get removeBlock() {\n        this.titleBlock.remove();\n    }\n\n    async deletion() {\n        await this.api.delete(this.endPoint);\n        this.removeBlock;\n    }\n\n    async edition() {\n        await this.api.update(this.endPoint, this.data);\n        this.updateTitle;\n    }   \n}\n\n\n// Set up front-end functionalities for action buttons such as: `Edit`, `Delete`, and `Close`.\nclass ActionBtnFunc {\n    constructor(e) {\n        this.elm = e; // current: edit, check, trash or close icon.\n        this.titleCont = titleCont;\n        this.id = e.target.id;\n        this.curLi = document.getElementById(`li-${this.id}`);\n        this.titleElm = document.getElementById(`title-${this.id}`); //  <a href=\"{% url 'topic' topic.slug %}\"...\n        this.titleElm.contentEditable = 'false';\n    }\n\n    get delete() {\n        this.curLi.addEventListener('click', _mixins__WEBPACK_IMPORTED_MODULE_1__.Prevent.click);\n        this.titleCont.store(this.titleElm.textContent.trim());\n        this.titleElm.textContent = 'წავშალო?';\n        this.titleElm.focus();\n        this.titleElm.style.cursor = 'default';\n        this.elm.parent.classList.add('hide-element'); // Hide the class='topic-title-act-btn'\n        this.elm.nextSibling.classList.add('display-act-btn-confirm'); // Display confirmation container\n    }\n\n    get close() {\n        this.curLi.removeEventListener('click', _mixins__WEBPACK_IMPORTED_MODULE_1__.Prevent.click);\n        this.titleElm.style.cursor = 'pointer';\n        this.elm.parent.classList.remove('display-act-btn-confirm'); // ---> class='act-btn-confirm'\n        this.elm.prevSibling.classList.remove('hide-element'); // class='topic-title-act-btn'\n        this.titleElm.textContent = this.titleCont.get;\n    }\n\n    get edit() {\n        this.titleElm.contentEditable = 'true';\n        this.titleElm.focus();\n        this.titleCont.store(this.titleElm.textContent.trim());\n        this.elm.nextSibling.classList.add('display-act-btn-confirm'); // Display action buttons.\n    }\n\n}\n\n//# sourceURL=webpack://geoai/./js/original/chat/functions.js?");

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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Chars: () => (/* binding */ Chars),\n/* harmony export */   CheckLetter: () => (/* binding */ CheckLetter),\n/* harmony export */   Convert: () => (/* binding */ Convert),\n/* harmony export */   CurrentAction: () => (/* binding */ CurrentAction),\n/* harmony export */   Element: () => (/* binding */ Element),\n/* harmony export */   GrabElements: () => (/* binding */ GrabElements),\n/* harmony export */   GrabID: () => (/* binding */ GrabID),\n/* harmony export */   Prevent: () => (/* binding */ Prevent),\n/* harmony export */   SetEvent: () => (/* binding */ SetEvent),\n/* harmony export */   Slug: () => (/* binding */ Slug),\n/* harmony export */   Store: () => (/* binding */ Store),\n/* harmony export */   Target: () => (/* binding */ Target)\n/* harmony export */ });\nclass GrabElements {\n    static for(attr) {\n        return Array.from(document.querySelectorAll(attr));\n    }\n}\n\n\nclass SetEvent {\n    static to(element, event, func) {\n        element.forEach(elm => {\n            elm.addEventListener(event, func);\n        });\n    }\n}\n\n\nclass Target {\n    constructor(e) {\n        this.e = e;\n    }\n    \n    get classes() {\n        return this.e.target.className.split(\" \");\n    }\n\n    // Grabs the element from the right.\n    curClasse(nth) {\n        return this.classes[this.classes.length - nth];\n    }\n\n    get target() {\n        return this.e.target;\n    }\n\n    get parent() {\n        return this.target.parentNode;\n    }\n\n    get nextSibling() {\n        return this.parent.nextElementSibling;\n    }\n\n    get prevSibling() {\n        return this.parent.previousElementSibling;\n    }\n\n    get topicTitle() {\n        return this.parent.parentNode.previousElementSibling;\n    }\n\n    setContent(elm, attr, text) {\n        elm.querySelector(attr).textContent = text;\n    }\n\n    static id(e) {\n        return e.target.id;\n    }\n\n}\n\n\n\nclass GrabID {\n    static from(e) {\n        return e.target.id;\n    }\n}\n\n\nclass CurrentAction {\n    static get(act) {\n        return act;\n    }\n}\n\n\nclass Chars {\n    static get geoEng() {\n        return {\n            'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v',\n            'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm',\n            'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's',\n            'უ': 'u', 'ფ': 'f', 'ქ': 'q', 'ღ': 'gh', 'ყ': 'k', 'შ': 'sh',\n            'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh',\n            'ჯ': 'j', 'ჰ': 'h', ' ': ' '\n        }\n    }\n}\n\n\nclass Slug {\n    static get(text){\n        return text\n            .toString()         // Convert to a string\n            .toLowerCase()      // Convert the string to lower case\n            .trim()             // Remove spaces from the start and end of the string\n            .replace(/\\s+/g, '-')   // Replace spaces with -\n            .replace(/[^\\w\\-]+/g, '')   // Remove all non-word characters\n            .replace(/\\-\\-+/g, '-');  // Replace multiple - with single -\n    }\n}\n\n\nclass CheckLetter {\n    static ifGeo(letter) {\n        // Georgian letter's RegExp patter.\n        const georgianPattern = /[\\u10A0-\\u10FF]/;\n\n        // Returns true if pattern matches, otherwise false.\n        return georgianPattern.test(letter);\n    }\n}\n\n\nclass Convert {\n    static toEng(text) {\n        let result = '';\n        for (let i = 0; i < text.length; i++) {\n            // If the letter is Georgian and it is in chars dict. \n            if (CheckLetter.ifGeo(text[i]) && text[i] in Chars.geoEng) {\n                result += Chars.geoEng[text[i]];\n            } else {\n                result += text[i];\n            } \n        }\n        return result;\n    }\n}\n\n\nclass Store{\n    constructor() {\n        this.truck = {}\n    }\n\n    store(stp) {\n        this.step = stp;\n        this.truck[this.step] = this.step;\n    }\n\n    get get() {\n        return this.truck[this.step];\n    }\n\n    get clear() {\n        this.truck = {}\n    }\n}\n\nclass Prevent {\n    static click(e) {\n        e.preventDefault();\n        console.log('prevent');\n        return false;\n    }\n}\n\n\nclass Element {\n    static setup(attr, event, func) {\n        const element = GrabElements.for(attr);\n        SetEvent.to(element, event, func);\n    }\n}\n\n\n\n\n\n//# sourceURL=webpack://geoai/./js/original/chat/mixins.js?");

/***/ }),

/***/ "./js/original/chat/sidebar.js":
/*!*************************************!*\
  !*** ./js/original/chat/sidebar.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _mixins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mixins */ \"./js/original/chat/mixins.js\");\n/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utilities */ \"./js/original/chat/utilities.js\");\n/* harmony import */ var _apiClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./apiClient */ \"./js/original/chat/apiClient.js\");\n/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./functions */ \"./js/original/chat/functions.js\");\n/*\n    This script adds interection to the topic title's action buttons\n    such as Edit, Delete, Approve and close.\n*/\n\n\n\n\n\nlet loader = new _utilities__WEBPACK_IMPORTED_MODULE_1__.ModuleLoader([\n    { module: 'mixins', func: 'Target' },\n    { module: 'utilities', func: 'Slugify' },\n    { module: 'mixins', func: 'CurrentAction' },\n    // { module: 'topicTitleActions', func: 'topicTitleActions' },\n]);\n\n// const l = document.querySelector('.act-btn-confirm');\n// l.addEventListener('mouseleave', () => {\n//     console.log('leaved');\n// });\n\nlet actionWrapper = _mixins__WEBPACK_IMPORTED_MODULE_0__.GrabElements.for('.act-wrapper');\nactionWrapper.forEach(element => {\n    const titleLi = element.parentNode; // <li id='li-{{topic.id}}'>\n    _mixins__WEBPACK_IMPORTED_MODULE_0__.SetEvent.to([titleLi], 'mouseleave', () => _functions__WEBPACK_IMPORTED_MODULE_3__.leaveActBtn.hide(titleLi));\n    _mixins__WEBPACK_IMPORTED_MODULE_0__.SetEvent.to([element], 'click', _functions__WEBPACK_IMPORTED_MODULE_3__.TitleAction.define);\n});\n\n\n\n// Testing \n\nfunction testFunc(e) {\n    e.preventDefault();\n    try {\n        loader.load(['Slugify', 'Target', 'CurrentAction']).then(mixins => {\n            const url = 'http://' + window.location.host + '/api/';\n            const id = mixins.Target.id(e);\n            const endPoint = `topics/${id}/`;\n\n            const updated_title = 'da me vashaaaa'\n            // const slugify = mixins.Slugify();\n            const slugA = mixins.Slugify.result(updated_title)\n            const data = {\n                \"user\": \"http://127.0.0.1:8000/api/users/aleksandre.development@gmail.com\",\n                \"title\": updated_title,\n                \"slug\": slugA\n            }\n\n            const api = new _apiClient__WEBPACK_IMPORTED_MODULE_2__.APIClient(url)\n            const current = mixins.CurrentAction.get('update'); // Testing\n            console.log(current)\n            if (current == 'delete') {\n                console.log(endPoint);\n                api.delete(endPoint)\n            } else if (current == 'update') {\n                if (data) {\n                    console.log('data')\n                    api.update(endPoint, data)\n                }\n            }\n            console.log(url);\n        });\n    } catch (error) {\n       throw new Error(`Failed to load module: f${error.message}`);\n    }\n    \n}\n\n// Element.setup('.geoai-check-icon', 'click', testFunc);\n\n// // Get Cookies\n// class Cookie {\n//     constructor(name) {\n//         this.name = name;\n//     }\n\n//     _decodeCookie(cookie) {\n//             return decodeURIComponent(cookie.split('=')[1]);\n//     }\n\n//     get(){\n//         const cookieValue = document.cookie\n//         .split('; ')\n//         .find(raw => raw.startsWith(this.name + '='));\n//         return cookieValue ? this._decodeCookie(cookieValue) : null;\n\n//     }\n// }\n\n// // Deleting and updating topics.\n// export class APIClient {\n//     constructor(baseUrl){\n//         this.baseUrl = baseUrl\n//         this.cookie = new Cookie('csrftoken')\n//         this.errorText = 'ვერ მოხერხდა მოთხოვნის შესრულება, გთხოვთ ცადოთ ახლიდან. ';\n//     }\n\n\n//     async _request(method, endpoint, data){\n//         let response;\n\n//         try {\n//             response = await fetch(`${this.baseUrl}${endpoint}`,{\n//                 method: method,\n//                 headers: {\n//                     'Content-type' : 'application/json',\n//                     'x-CSRFToken': this.cookie.get(),\n//                 },\n//                 credentials: 'same-origin',\n//                 body: data ? JSON.stringify(data) : null\n//             });\n//         } catch (error) {\n//             throw new Error(this.errorText + error)\n//         }\n\n//         if (!response.ok) {\n//             throw new Error(this.errorText + response.statusText)\n//         }\n\n//         if (response.status != 204) {\n//             return response.json();\n//         } else {\n//             return null;\n//         } \n        \n//     }\n\n//     async update(endpoint, data) {\n//         return this._request('PUT', endpoint, data)\n//     }\n\n//     async delete(endpoint) {\n//         return this._request('DELETE', endpoint);\n//     }\n// }\n\n\n//# sourceURL=webpack://geoai/./js/original/chat/sidebar.js?");

/***/ }),

/***/ "./js/original/chat/utilities.js":
/*!***************************************!*\
  !*** ./js/original/chat/utilities.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ModuleLoader: () => (/* binding */ ModuleLoader),\n/* harmony export */   Slugify: () => (/* binding */ Slugify),\n/* harmony export */   Unique: () => (/* binding */ Unique)\n/* harmony export */ });\n/* harmony import */ var _mixins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mixins */ \"./js/original/chat/mixins.js\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid */ \"./node_modules/uuid/dist/esm-browser/v4.js\");\n\n\n\n\nclass Unique {\n    static get ID() {\n        return (0,uuid__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    }\n}\n\nclass Slugify {\n    static result(text) {\n        return text ? _mixins__WEBPACK_IMPORTED_MODULE_0__.Slug.get(_mixins__WEBPACK_IMPORTED_MODULE_0__.Convert.toEng(text)) : null;\n    }\n}\n\n\nclass ModuleLoader{\n    constructor(modules) {\n        // obj.reduce(accumulator, currentValue, currentIndex, sourceArray) => {}\n        this.modules = modules.reduce((obj, module) => {\n            obj[module.func] = module;\n            return obj;\n        }, {});\n    }\n\n    async load(moduleName) {\n        let combinedModules = {}\n        const imports = moduleName.map(async (moduleName) => {\n            const {module, func} = this.modules[moduleName];\n            return __webpack_require__(\"./js/original/chat lazy recursive ^\\\\.\\\\/.*$\")(`./${module}`)\n                .then(moduleObj => {\n                    if (moduleObj[func]) {\n                        combinedModules[func] = moduleObj[func];\n                    } else {\n                        throw new Error(`Module ${module} does not export a function ${func}.`);\n                    }\n                });\n        });\n        return Promise.all(imports).then(() => combinedModules);\n    }\n}\n\n//# sourceURL=webpack://geoai/./js/original/chat/utilities.js?");

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

eval("var map = {\n\t\"./apiClient\": \"./js/original/chat/apiClient.js\",\n\t\"./apiClient.js\": \"./js/original/chat/apiClient.js\",\n\t\"./functions\": \"./js/original/chat/functions.js\",\n\t\"./functions.js\": \"./js/original/chat/functions.js\",\n\t\"./main\": \"./js/original/chat/main.js\",\n\t\"./main.js\": \"./js/original/chat/main.js\",\n\t\"./mixins\": \"./js/original/chat/mixins.js\",\n\t\"./mixins.js\": \"./js/original/chat/mixins.js\",\n\t\"./sidebar\": \"./js/original/chat/sidebar.js\",\n\t\"./sidebar.js\": \"./js/original/chat/sidebar.js\",\n\t\"./utilities\": \"./js/original/chat/utilities.js\",\n\t\"./utilities.js\": \"./js/original/chat/utilities.js\",\n\t\"./websocket\": \"./js/original/chat/websocket.js\",\n\t\"./websocket.js\": \"./js/original/chat/websocket.js\",\n\t\"./websocketHelpers\": \"./js/original/chat/websocketHelpers.js\",\n\t\"./websocketHelpers.js\": \"./js/original/chat/websocketHelpers.js\"\n};\n\nfunction webpackAsyncContext(req) {\n\treturn Promise.resolve().then(() => {\n\t\tif(!__webpack_require__.o(map, req)) {\n\t\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\t\te.code = 'MODULE_NOT_FOUND';\n\t\t\tthrow e;\n\t\t}\n\n\t\tvar id = map[req];\n\t\treturn __webpack_require__(id);\n\t});\n}\nwebpackAsyncContext.keys = () => (Object.keys(map));\nwebpackAsyncContext.id = \"./js/original/chat lazy recursive ^\\\\.\\\\/.*$\";\nmodule.exports = webpackAsyncContext;\n\n//# sourceURL=webpack://geoai/./js/original/chat/_lazy_^\\.\\/.*$_chunkName:_%5Brequest%5D_namespace_object?");

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
/******/ 		// The chunk loading function for additional chunks
/******/ 		// Since all referenced chunks are already included
/******/ 		// in this file, this function is empty here.
/******/ 		__webpack_require__.e = () => (Promise.resolve());
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
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./js/original/chat/main.js");
/******/ 	
/******/ })()
;