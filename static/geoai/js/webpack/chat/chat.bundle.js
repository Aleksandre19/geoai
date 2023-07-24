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

/***/ "./js/original/chat/functions.js":
/*!***************************************!*\
  !*** ./js/original/chat/functions.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Func: () => (/* binding */ Func),\n/* harmony export */   leaveActBtn: () => (/* binding */ leaveActBtn)\n/* harmony export */ });\n/* harmony import */ var _mixins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mixins */ \"./js/original/chat/mixins.js\");\n/* harmony import */ var _titleActionBtn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./titleActionBtn */ \"./js/original/chat/titleActionBtn.js\");\n\n\n\n\n// Functions used acrose the application.\nclass leaveActBtn {\n    static hide(titleWrapper) {\n        titleWrapper.removeEventListener('click', _mixins__WEBPACK_IMPORTED_MODULE_0__.Prevent.click);\n        const wrapperID = titleWrapper.id.split('-')['1']; // <li id='li-{{topic.id}}'>\n        const titleElm = document.getElementById(`title-${wrapperID}`) // <a href=\"{% url 'topic' topic.slug %}\"...\n        titleElm.style.cursor = 'pointer';\n        titleElm.contentEditable = 'false';\n        // Replace confirmation message with original title's content if delete was triggered before.\n        const curActions = ['delete']; // Click on trash icon.\n        if (curActions.includes(_titleActionBtn__WEBPACK_IMPORTED_MODULE_1__.titleAct.get))\n            titleElm.textContent = _titleActionBtn__WEBPACK_IMPORTED_MODULE_1__.titleCont.get;\n            _titleActionBtn__WEBPACK_IMPORTED_MODULE_1__.titleAct.clear;\n        \n        const actBtnElm = titleWrapper.querySelector('.act-btn-confirm');\n        const linkElm = titleWrapper.querySelector('.title-link');\n        actBtnElm.classList.remove('display-act-btn-confirm')\n        linkElm.blur();\n    }\n};\n\n\n// This class runes the function from the array.\nclass Func {\n    static execute(funcs, curClasse) {\n        funcs.forEach((actions) => {\n            if (!actions[curClasse]) return;\n\n            for (const action of actions[curClasse])\n                action();\n        });\n    }\n} \n\n\n//# sourceURL=webpack://geoai/./js/original/chat/functions.js?");

/***/ }),

/***/ "./js/original/chat/main.js":
/*!**********************************!*\
  !*** ./js/original/chat/main.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _websocket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./websocket */ \"./js/original/chat/websocket.js\");\n/* harmony import */ var _sidebar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sidebar */ \"./js/original/chat/sidebar.js\");\n\n\n\n// Get slug.\nlet slug = JSON.parse(document.getElementById('slug').textContent); \n\n_sidebar__WEBPACK_IMPORTED_MODULE_1__.Sidebar.setup; // Setup sidebar.\n\n// instantiate WebSocketClient.\nnew _websocket__WEBPACK_IMPORTED_MODULE_0__.WebSocketClient(slug); \n\n//# sourceURL=webpack://geoai/./js/original/chat/main.js?");

/***/ }),

/***/ "./js/original/chat/mixins.js":
/*!************************************!*\
  !*** ./js/original/chat/mixins.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Button: () => (/* binding */ Button),\n/* harmony export */   Chars: () => (/* binding */ Chars),\n/* harmony export */   CheckLetter: () => (/* binding */ CheckLetter),\n/* harmony export */   Convert: () => (/* binding */ Convert),\n/* harmony export */   CurrentAction: () => (/* binding */ CurrentAction),\n/* harmony export */   GrabElements: () => (/* binding */ GrabElements),\n/* harmony export */   GrabID: () => (/* binding */ GrabID),\n/* harmony export */   Prevent: () => (/* binding */ Prevent),\n/* harmony export */   Remove: () => (/* binding */ Remove),\n/* harmony export */   Scroll: () => (/* binding */ Scroll),\n/* harmony export */   SetEvent: () => (/* binding */ SetEvent),\n/* harmony export */   Slug: () => (/* binding */ Slug),\n/* harmony export */   Store: () => (/* binding */ Store),\n/* harmony export */   Target: () => (/* binding */ Target),\n/* harmony export */   Url: () => (/* binding */ Url)\n/* harmony export */ });\n// Grab elements from the DOM.\nclass GrabElements {\n    static for(attr) {\n        // Return an array of elements.\n        return Array.from(document.querySelectorAll(attr));\n    }\n\n    // Grab single element.\n    static single(attr) {\n        return document.querySelector(attr);\n    }\n}\n\n\n// Set event to element.\nclass SetEvent {\n    static to(element, event, func) {     \n        element.forEach(elm => {\n            // Set event to element.\n            elm.addEventListener(event, func);\n        });\n    }\n}\n\n\nclass Target { \n    constructor(e) {\n        this.e = e;\n    }\n    \n    // Get element's classes.\n    get classes() {\n        // Split the class attribute by space.\n        return this.e.target.className.split(\" \");\n    }\n\n    // Get element's class last attribute.\n    curClasse(nth) {\n        return this.classes[this.classes.length - nth];\n    }\n\n    // Get the element that triggered the event.\n    get target() {\n        return this.e.target;\n    }\n\n    // Get the parent element of the element that triggered the event.\n    get parent() {\n        return this.target.parentNode;\n    }\n\n    // Get the parent element's next element.\n    get nextSibling() {\n        return this.parent.nextElementSibling;\n    }\n\n    // Get the parent element's previous element.\n    get prevSibling() {\n        return this.parent.previousElementSibling;\n    }\n\n\n    get topicTitle() {\n        // Get the parent element's previous element.\n        return this.parent.parentNode.previousElementSibling;\n    }\n\n    // Set content to element.\n    setContent(elm, attr, text) {\n        elm.querySelector(attr).textContent = text;\n    }\n\n    // Get element's id.\n    static id(e) {\n        return e.target.id;\n    }\n\n}\n\n\n// Get the element's id that triggered the event.\nclass GrabID {\n    static from(e) {\n        return e.target.id;\n    }\n}\n\n\n// Get current action.\nclass CurrentAction {\n    static get(act) {\n        return act;\n    }\n}\n\n\n// Georgian to English characters.\nclass Chars {\n    static get geoEng() {\n        return {\n            'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v',\n            'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm',\n            'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's',\n            'უ': 'u', 'ფ': 'f', 'ქ': 'q', 'ღ': 'gh', 'ყ': 'k', 'შ': 'sh',\n            'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh',\n            'ჯ': 'j', 'ჰ': 'h', ' ': ' '\n        }\n    }\n}\n\n\n// Get text and return slug.\nclass Slug {\n    static get(text){ \n        return text\n            .toString()         // Convert to a string\n            .toLowerCase()      // Convert the string to lower case\n            .trim()             // Remove spaces from the start and end of the string\n            .replace(/\\s+/g, '-')   // Replace spaces with -\n            .replace(/[^\\w\\-]+/g, '')   // Remove all non-word characters\n            .replace(/\\-\\-+/g, '-');  // Replace multiple - with single -\n    }\n}\n\n\n// Check if the letter is Georgian.\nclass CheckLetter {\n    static ifGeo(letter) {\n        // Georgian letter's RegExp patter.\n        const georgianPattern = /[\\u10A0-\\u10FF]/;\n\n        // Returns true if pattern matches, otherwise false.\n        return georgianPattern.test(letter);\n    }\n}\n\n\n// Convert Georgian to English.\nclass Convert {\n    static toEng(text) {\n        let result = '';\n        for (let i = 0; i < text.length; i++) {\n            // If the letter is Georgian and it is in chars dict. \n            if (CheckLetter.ifGeo(text[i]) && text[i] in Chars.geoEng) {\n                result += Chars.geoEng[text[i]];\n            } else {\n                result += text[i];\n            } \n        }\n        return result;\n    }\n}\n\n\n// Storage for title content.\nclass Store{ \n    constructor() {\n        this.truck = {}\n    }\n\n    // Store title content.\n    store(stp) {\n        this.step = stp;\n        this.truck[this.step] = this.step;\n    }\n\n    // Get title content.\n    get get() {\n        return this.truck[this.step];\n    }\n\n    // Clear title content.\n    get clear() {\n        this.truck = {}\n    }\n}\n\n// Prevent default action.\nclass Prevent { \n    static click(e) {\n        e.preventDefault();\n        return false;\n    }\n}\n\n\n// Generate url for API.\nclass Url {\n    static setup(protocol, path, slug) {   \n        const domain = window.location.host; // Get domain name.\n        return `${protocol}${domain}${path}${slug}`;\n    }\n}\n\n\n// Button functionalities.\nclass Button {\n    // Disable button.\n    static disable(attr) {\n        const elm = GrabElements.single(attr);\n        elm.disabel = true;\n        elm.classList.add('disabled-btn');\n    }\n\n    // Enable button.\n    static enable(attr) {\n        const elm = GrabElements.single(attr);\n        elm.disabel = false;\n        elm.classList.remove('disabled-btn');\n    }\n}\n\n\n// Scroll to bottom.\nclass Scroll { \n    static toBottom(attr) {\n        const element = document.querySelector(attr);\n        element.scrollTo({ top: element.scrollHeight, behaviour: 'smooth' }); \n    }\n}\n\n\n // Remove loading gif.\nclass Remove {\n    static Loading(attr, attr2) {\n        const elm = document.querySelector(attr);\n        elm.classList.remove(attr2);\n    }\n}\n\n\n// Jus for remainder. \n// i = (i + 1) % array.length ---> `i` will not go over the length of the array.\n\n\n\n\n\n//# sourceURL=webpack://geoai/./js/original/chat/mixins.js?");

/***/ }),

/***/ "./js/original/chat/sidebar.js":
/*!*************************************!*\
  !*** ./js/original/chat/sidebar.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Sidebar: () => (/* binding */ Sidebar)\n/* harmony export */ });\n/* harmony import */ var _mixins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mixins */ \"./js/original/chat/mixins.js\");\n/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./functions */ \"./js/original/chat/functions.js\");\n/* harmony import */ var _titleActionBtn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./titleActionBtn */ \"./js/original/chat/titleActionBtn.js\");\n\n\n\n\nclass Sidebar {\n    static get setup() { \n        let actionWrapper = _mixins__WEBPACK_IMPORTED_MODULE_0__.GrabElements.for('.act-wrapper');\n        actionWrapper.forEach(element => {\n            const titleLi = element.parentNode; // <li id='li-{{topic.id}}'>\n            _mixins__WEBPACK_IMPORTED_MODULE_0__.SetEvent.to([titleLi], 'mouseleave', () => _functions__WEBPACK_IMPORTED_MODULE_1__.leaveActBtn.hide(titleLi));\n            _mixins__WEBPACK_IMPORTED_MODULE_0__.SetEvent.to([element], 'click', _titleActionBtn__WEBPACK_IMPORTED_MODULE_2__.TitleActionBtn.define);\n        });\n    }\n}\n\n\n//# sourceURL=webpack://geoai/./js/original/chat/sidebar.js?");

/***/ }),

/***/ "./js/original/chat/titleActionBtn.js":
/*!********************************************!*\
  !*** ./js/original/chat/titleActionBtn.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   TitleActionBtn: () => (/* binding */ TitleActionBtn),\n/* harmony export */   titleAct: () => (/* binding */ titleAct),\n/* harmony export */   titleCont: () => (/* binding */ titleCont)\n/* harmony export */ });\n/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utilities */ \"./js/original/chat/utilities.js\");\n/* harmony import */ var _mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mixins */ \"./js/original/chat/mixins.js\");\n\n\nconst titleAct = new _mixins__WEBPACK_IMPORTED_MODULE_1__.Store(); // Title action storage.\nconst titleCont = new _mixins__WEBPACK_IMPORTED_MODULE_1__.Store(); // Title content storage.\n\n\n// Map functions to their moduls. \nlet loader = new _utilities__WEBPACK_IMPORTED_MODULE_0__.ModuleLoader([\n    { module: 'mixins', func: 'Target' },\n    { module: 'mixins', func: 'Url' },\n    { module: 'apiClient', func: 'APIClient' },\n    { module: 'utilities', func: 'Slugify' },\n    { module: 'functions', func: 'Func'},\n]);\n\n\n// Define actions (edit, delete) to topic titles. \nclass TitleActionBtn {\n    static define(e) {\n        e.preventDefault();\n        try {\n            new BtnSteup(e, titleAct);\n        } catch (error) { \n            throw new Error(error.message);\n        }\n    }\n}\n\n\nclass BtnSteup {\n    constructor(e, titleAct) {     \n        this.e = e; // Current button action event.\n        this.init();\n        this.titleAct = titleAct; // The action storage.\n    }\n\n    async init() {\n        try {\n            // Load necessary functions on event from mixins.js.\n            this.mixins = await loader.load([\n                'Target', 'APIClient', 'Slugify', 'Func', 'Url']);\n\n            // Set up the required data.\n            this.elm = new this.mixins.Target(this.e); // Get element for the current event.\n            this.curClasse = this.elm.curClasse(1); // Get element's class attribute.\n \n            // Determine the classes from where a request is accepted.\n            const allowedClasses = [\n                'geoai-check-icon', 'geoai-trash-icon',\n                'geoai-x-icon', 'geoai-edit-icon'\n            ]\n\n            // Check if the request is allowed.\n            if (!allowedClasses.includes(this.curClasse))\n                return;\n            \n            // Front-end functionalitties for action buttons such as: `Edit`, `Delete`, `Close`.\n            this.action = new BtnFrontEndFunc(this.elm);\n\n            // Button action methods.\n            this.handleAction();\n\n        } catch (error) {\n            throw new Error(`Something went wrong. ${error.message}`);\n        }\n    }\n\n    // Prepare and execute button action methods.\n    handleAction() {\n        // Map the elements to their corresponding methods by class attribute.\n        const exacute = [ \n            {'geoai-check-icon': [() => this.confirm()]}, // Confirm.\n            {'geoai-trash-icon': [() => this.action.delete, () => this.titleAct.store('delete')]}, // Delete.\n            {'geoai-x-icon': [() => this.action.close]}, // Close.\n            {'geoai-edit-icon': [() => this.action.edit, () => this.titleAct.store('edit')]} // Edit.\n        ];\n\n        // Function executor.\n        this.mixins.Func.execute(exacute, this.curClasse);\n    }\n\n    confirm() {\n        // Check if the action is allowed.\n        const allowedActs = ['edit', 'delete'];\n        if (!allowedActs.includes(this.titleAct.get))\n            return;\n        \n        // Method which prepares everything before sending request to the API client.\n        const PrepRequest = new PrepareRequest(this.e, this.mixins);\n\n        const exacute = [ // Map the action types to their corresponding methods.\n            {'edit': [() => PrepRequest.edition()]},\n            {'delete': [() => PrepRequest.deletion()]},\n        ];\n\n        // Function executor.\n        this.mixins.Func.execute(exacute, this.titleAct.get);\n    }\n}\n\n// Prepare everything and call to the API client methods.\nclass PrepareRequest {\n    constructor(e, mixins) {\n        this.e = e; // class='geoai-check-icon'\n        this.mixins = mixins;\n        this.id = this.mixins.Target.id(this.e);\n        this.titleBlock = document.getElementById(`li-${this.id}`); // <li id='li-{{topic.id}}'>   \n        this.curTitle = document.getElementById(`title-${this.id}`);// Title `a` element.\n        this.endPoint = `topics/${this.id}/`;\n        this.url = this.mixins.Url.setup('http://','/api/', '');      \n        this.api = new this.mixins.APIClient(this.url); // API Client.\n        this.slug = this.mixins.Slugify.result(this.trimTitle);\n        this.userID = document.getElementById('userID').textContent; // Current user ID.     \n    }\n\n    // Trim title content.\n    get trimTitle() {\n        return this.curTitle.textContent.trim().substring(0, 15);\n    }\n\n    // Set up a data for the `fetch` method of the APIClient.\n    get data() {\n        return {\n            \"user\": `${this.url}users/${this.userID}`,\n            \"title\": this.trimTitle,\n            \"slug\": this.slug\n        };\n    }\n\n    // Update urls.\n    get updateUrl() {\n        const curPage = document.getElementById('currentPage').textContent; // Current page.\n        const origSlug = this.mixins.Slugify.result(titleCont.get); // Original slug/\n        const newUrl = this.mixins.Url.setup('http://','/chat/', `${this.slug}/`);\n        const pages = ['chat']; // Page.\n\n        // Check if current page is not home.\n        if (!pages.includes(curPage)) {\n            \n            // Update only the current topic URL in the browser address bar.\n            if(curPage === origSlug)\n                window.history.pushState({}, '', newUrl); \n            \n            this.curTitle.setAttribute('href', newUrl);\n            return;\n        }\n\n        // If current page is home.\n        if (pages.includes(curPage)) {\n            // Update a `href` attribute of the topic title.\n            this.curTitle.setAttribute('href', newUrl);\n        }\n    }\n\n    // Update title after succesfully response from the server.\n    get updateTitle() {\n        // If titles length is more than 15, add ellipsis.\n        const addEllipsis = this.trimTitle.length < 15\n            ? this.trimTitle : this.trimTitle + '...';\n        \n        // Set updated content to title.\n        this.curTitle.textContent = addEllipsis;\n\n        // Add a mouse ponter back.\n        this.curTitle.style.cursor = 'pointer';\n\n        // Toggling styles of action btn and confirm btn blocks.\n        this.e.target.parentNode.classList\n            .remove('display-act-btn-confirm'); // ---> class='act-btn-confirm'\n        this.e.target.parentNode.previousElementSibling\n            .classList.remove('hide-element'); // class='topic-title-act-btn'\n    }\n\n    // Remove title from the side bar when is has been deleted in server.\n    get removeBlock() {\n        this.titleBlock.remove();\n    }\n\n    // Call API's deletetion.\n    async deletion() {\n        await this.api.delete(this.endPoint);\n        this.removeBlock;\n    }\n\n    // Call API's edition.\n    async edition() {\n        await this.api.update(this.endPoint, this.data);\n        this.updateTitle;\n        this.updateUrl;\n    }   \n}\n\n\n// Set up front-end functionalities for action buttons such as: `Edit`, `Delete`, and `Close`.\nclass BtnFrontEndFunc {\n    constructor(e) {\n        this.elm = e; // current: edit, check, trash or close icon.\n        this.titleCont = titleCont; // Storage for title content.\n        this.id = e.target.id;\n        this.curLi = document.getElementById(`li-${this.id}`); // Title parent `<li>` element.\n        this.titleElm = document.getElementById(`title-${this.id}`); //  <a href=\"{% url 'topic' topic.slug %}\"...\n        this.titleElm.contentEditable = 'false';\n    }\n\n    // Front-end of deletion.\n    get delete() {\n        this.curLi.addEventListener('click', _mixins__WEBPACK_IMPORTED_MODULE_1__.Prevent.click);\n        this.titleCont.store(this.titleElm.textContent.trim());\n        this.titleElm.textContent = 'წავშალო?'; // Confirmation text.\n        this.titleElm.focus();\n        this.titleElm.style.cursor = 'default';\n        this.elm.parent.classList.add('hide-element'); // Hide the class='topic-title-act-btn'\n        this.elm.nextSibling.classList.add('display-act-btn-confirm'); // Display confirmation container\n    }\n\n    // Front-end of closing.\n    get close() {\n        this.curLi.removeEventListener('click', _mixins__WEBPACK_IMPORTED_MODULE_1__.Prevent.click);\n        this.titleElm.style.cursor = 'pointer';\n        this.elm.parent.classList.remove('display-act-btn-confirm'); // ---> class='act-btn-confirm'\n        this.elm.prevSibling.classList.remove('hide-element'); // class='topic-title-act-btn'\n        this.titleElm.textContent = this.titleCont.get; // Update with the title content.\n    }\n\n    // Front-end of edition.\n    get edit() {\n        this.titleElm.contentEditable = 'true';\n        this.titleElm.style.cursor = 'text';\n        this.titleElm.focus();\n        this.titleCont.store(this.titleElm.textContent.trim()); // Store title content.\n        this.elm.nextSibling.classList.add('display-act-btn-confirm'); // Display action buttons.\n    }\n\n}\n\n//# sourceURL=webpack://geoai/./js/original/chat/titleActionBtn.js?");

/***/ }),

/***/ "./js/original/chat/utilities.js":
/*!***************************************!*\
  !*** ./js/original/chat/utilities.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Element: () => (/* binding */ Element),\n/* harmony export */   ModuleLoader: () => (/* binding */ ModuleLoader),\n/* harmony export */   Slugify: () => (/* binding */ Slugify),\n/* harmony export */   Unique: () => (/* binding */ Unique)\n/* harmony export */ });\n/* harmony import */ var _mixins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mixins */ \"./js/original/chat/mixins.js\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid */ \"./node_modules/uuid/dist/esm-browser/v4.js\");\n// Import modules.\n\n\n\n// Generate unique id.\nclass Unique {\n    static get ID() {\n        return (0,uuid__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    }\n}\n\n// Slugify text.\nclass Slugify {\n    static result(text) { \n        // Check if text is not empty.\n        return text ? _mixins__WEBPACK_IMPORTED_MODULE_0__.Slug.get(_mixins__WEBPACK_IMPORTED_MODULE_0__.Convert.toEng(text)) : null;\n    }\n}\n\n\n\nclass ModuleLoader{ \n    constructor(modules) {\n        // Just for remainder --> obj.reduce(accumulator, currentValue, currentIndex, sourceArray) => {}\n        // Convert array to object.\n        this.modules = modules.reduce((obj, module) => { \n            obj[module.func] = module;\n            return obj;\n        }, {});\n    }\n\n    //\n    async load(moduleName) {\n        let combinedModules = {}\n        const imports = moduleName.map(async (moduleName) => { \n\n            // Get module and function name.\n            const { module, func } = this.modules[moduleName];\n            \n            // Import module and function.\n            return __webpack_require__(\"./js/original/chat lazy recursive ^\\\\.\\\\/.*$\")(`./${module}`)\n                .then(moduleObj => {\n                    // Check if the module exports the function.\n                    if (moduleObj[func]) { // If yes, add it to the combinedModules object.\n                        combinedModules[func] = moduleObj[func];\n                    } else {\n                        throw new Error(`Module ${module} does not export a function ${func}.`);\n                    }\n                });\n        });\n        // Wait for all imports to finish.\n        return Promise.all(imports).then(() => combinedModules); // Return combinedModules.\n    }\n}\n\n\nclass Element {\n    // Setup element.\n    static setup(attr, event, func) {\n        const element = _mixins__WEBPACK_IMPORTED_MODULE_0__.GrabElements.for(attr); // Get element.\n        _mixins__WEBPACK_IMPORTED_MODULE_0__.SetEvent.to(element, event, func); // Set event to element.\n    }\n\n    // Create elements.\n    static create(elements) {\n        let createdElements = {};\n        elements.forEach(elm => {\n            let uniqueID = Unique.ID;\n            \n            const newElm = document.createElement(elm.elm); // Create element.\n            if (elm.classe)\n                newElm.classList.add(...elm.classe); // Add classes to created elements.\n\n            // Set ids for created elements.\n            if (typeof elm.id != 'undefined')\n                newElm.id = elm.id.replace('ID', uniqueID);\n            \n            // Save ids of created elements.\n            if (elm.elm === 'p' && elm.id[0] === 'q')\n                createdElements['qp'] = newElm.id; // Question paragraph.\n            else if (elm.elm === 'p' && elm.id[0] === 'a')\n                createdElements['ap'] = newElm.id; // Answer paragraph.\n            else if (elm.elm === 'div' && elm.classe[0] === 'qa-block')\n                createdElements['qaBlock'] = newElm.id; // QA block.\n            \n            // Set image url.\n            if (typeof elm.imgUrl != 'undefined')\n                newElm.setAttribute('src', elm.imgUrl);\n            \n            // Save created elements.\n            createdElements[elm.parent] = newElm;\n\n        });\n\n        // Create elements hierarchy.\n        elements.forEach(elm => {\n            // Check if the element has a child and if the child is created.\n            if (elm.child === null || !createdElements[elm.child]) return;\n            // Append child to parent.\n            createdElements[elm.child].appendChild(createdElements[elm.parent]);\n        });\n\n        // Return created elements.\n        return createdElements;\n    }\n\n    // Append elements to container.\n    static appentToContainer(elms, attr) {\n        let container = document.querySelector(attr); // Get container.\n        container.appendChild(elms[1]); // Append root element to container.\n    }\n\n    // Set content to element.\n    static setContent(attr, text) { \n        document.querySelector(attr).textContent = text; // Set content.      \n    }\n}\n\n//# sourceURL=webpack://geoai/./js/original/chat/utilities.js?");

/***/ }),

/***/ "./js/original/chat/websocket.js":
/*!***************************************!*\
  !*** ./js/original/chat/websocket.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   WebSocketClient: () => (/* binding */ WebSocketClient)\n/* harmony export */ });\n/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utilities */ \"./js/original/chat/utilities.js\");\n/* harmony import */ var _mixins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mixins */ \"./js/original/chat/mixins.js\");\n\n\n\n\n// Load modules on event.\nconst loader = new _utilities__WEBPACK_IMPORTED_MODULE_0__.ModuleLoader([\n    { module: 'mixins', func: 'SetEvent' },\n    { module: 'mixins', func: 'Prevent' },\n    { module: 'mixins', func: 'Button' },\n    { module: 'mixins', func: 'Scroll' },\n    { module: 'mixins', func: 'Remove' },\n    { module: 'utilities', func: 'Slugify' },\n]);\n\n\n// WebSocket client.\nclass WebSocketClient {\n    constructor(slug) {\n        this.slug = slug; // Current slug.\n        this.newTopic = (!slug) ? null : slug;;\n        this.socketSlug = (slug) ? slug + '/' : ''; // add `/` for django urls.\n        this.questionSent = false;\n        this.init();\n        // console.log('Constructor newTopic', this.newTopic);\n    }\n\n    // Initialize the WebSocket.\n    init() { // Step 01.   \n        // Setup socket url.\n        this.socketUrl = _mixins__WEBPACK_IMPORTED_MODULE_1__.Url.setup('ws://', '/ws/chat/', this.socketSlug);\n\n        // Instantiate the WebSocket.\n        this.socket = new WebSocket(this.socketUrl); \n        \n        this.onClick(); // Step 02.\n    }\n\n    onClick() {\n        if(!this.questionSent) {\n            // Setup button element.\n            _utilities__WEBPACK_IMPORTED_MODULE_0__.Element.setup('#chat-message-submit',\n                'click', this.eventFunc.bind(this));\n        }\n    }\n\n    async eventFunc(e) { // Step 03 (Event function)\n        if (!this.questionSent) {\n            e.preventDefault();\n\n            this.questionInput = document.getElementById('chat-message-input');\n            this.questionText = this.questionInput.value; // Get input value.\n\n            // If input is empty, do nothing.\n            if (this.questionText == '')\n                return;\n            \n            await this.loadModulesOnEvent(); // Step 04 (Load modules on event).\n            this.questionSent = true;\n            this.newTopic = this.slug;\n            // console.log('eventFunc newTopic', this.newTopic);\n            // Disable button.\n            this.mixins.Button.disable('#chat-message-submit');\n            this.questionProcess(); // Step 05 (Question process)\n            \n        } else {\n            // If the message was sent, do nothing.\n            e.preventDefault(); return false;\n        }\n    }\n\n    // Load modules on event.\n    async loadModulesOnEvent() {\n        try {\n            this.mixins = await loader.load([\n                'SetEvent', 'Prevent', 'Button',\n                'Scroll', 'Remove', 'Slugify'\n            ]); \n        } catch (error) {\n            this.questionSent = false;\n            throw new Error(`Something went wrong. ${error.message}`);\n        }\n     } \n\n    async questionProcess() { \n        this.createQaElements; // Step 06 (Create elements).\n        this.appendElements; // Step 07 (Append elements to the container).\n        this.setContent; // Step 08 (Set content to the element).\n        this.mixins.Scroll.toBottom('.chat-qa-content'); // Step 09 (Scroll to bottom).\n        this.handleSlug; // Step 10 (If slug is empty, generate slug).\n        await this.sendQuestion(); // Step 11 (Send question to the server).\n        this.onSocketClose; // Step 12 (Handle socket close).\n        await this.receiveAnswer(); // Step 13 (Receive answer from the server).\n        this.addTitleToSidebar; // Step 14 (Add title to sidebar).\n    }\n\n    get createQaElements() {\n        // Loading image url.\n        const imageUrl = 'http://' + window.location.host + '/static/geoai/images/answer_waiting_gray.gif';\n        \n        // Setup elements settings.\n            // Important notes:\n            // 1. Element parent property is the index of the child element.\n            // 2. Class and ID names must be as same as it is in the this example.\n        const elmList = [\n            { elm: 'div', id: 'blockID', classe: ['qa-block'], parent: 1, child: null},\n            { elm: 'div', classe: ['q-block'], parent: 2, child: 1},\n            { elm: 'p', id: 'q-blockID', classe: ['q-paragraph', 'b-block-content'], parent: 3, child: 2},\n            { elm: 'div', classe: ['a-block', 'skeleton-loading'], parent: 4, child: 1},\n            { elm: 'p', id: 'aID', classe: ['q-paragraph', 'b-block-content'], parent: 5, child: 4},\n            { elm: 'img', classe: ['answer_waiting_gif'], imgUrl: imageUrl, parent: 6, child: 5}\n        ]\n\n        // Create elements.\n        this.createdElm = _utilities__WEBPACK_IMPORTED_MODULE_0__.Element.create(elmList)\n    }\n\n    // Append elements to container.\n    get appendElements() {\n        _utilities__WEBPACK_IMPORTED_MODULE_0__.Element.appentToContainer(\n            this.createdElm, '.chat-qa-content'\n        );\n    } \n    \n    // Set content to the element.\n    get setContent() {\n        _utilities__WEBPACK_IMPORTED_MODULE_0__.Element.setContent(\n            `#${this.createdElm['qp']}`, this.questionText\n        );\n    }\n\n    // If slug is empty, generate slug.\n    get handleSlug() {\n        if(!this.slug) {\n            this.slug = this.mixins.Slugify.result(\n                this.questionText.slice(0, 20)\n            );\n        }\n    }\n\n    // Send question to the server.\n    async sendQuestion() {\n        await new Promise((resolve, reject) => { \n            try {\n                this.socket.send(JSON.stringify({\n                    'message': this.questionText,\n                    'slug': this.slug,\n                }));\n                resolve();\n            } catch (error) {   \n                reject(error);\n            }\n        });\n        this.questionInput.value = '';\n    }\n\n    // Handle socket close.\n    get onSocketClose() { \n        this.socket.onclose = function (e) {\n            console.error('Chat socket closed unexpectedly');\n        };\n    }\n    \n    // Receive answer from the server.\n    async receiveAnswer() {\n        await new Promise((resolve, reject) => {\n            try {\n                this.socket.onmessage = (e) => {\n                    this.socketMessage.bind(this)(e);\n                    resolve();\n                };  \n            } catch (error) {\n                reject(error);\n            }\n         });\n    }\n\n    // Socket function.\n    socketMessage(e) {\n        const data = JSON.parse(e.data); // Parse data.\n        document.querySelector('.answer_waiting_gif').style.display = 'none'; // Hide loading gif.\n        document.querySelector('#' + this.createdElm['ap']).innerHTML = (data.message + '\\n'); // Set answer content.\n        this.mixins.Remove.Loading(`#${this.createdElm['qaBlock']} > .a-block`, 'skeleton-loading'); // Remove loading gif.\n        this.mixins.Button.enable('#chat-message-submit'); // Enable button.\n        this.mixins.Scroll.toBottom('.chat-qa-content'); // Scroll to bottom.\n        this.slug = data.slug;\n        this.questionSent = false;\n    }\n\n    get addTitleToSidebar() {\n        // console.log('eventFunc newTopic', this.newTopic);\n        if (this.newTopic) return; // If slug is not empty, do nothing.\n\n        if(!this.newTopic) {\n            const elmList = [\n                { elm: 'li', id: 'li-ID', parent: 1, child: null },\n                { elm: 'a', id: 'a-ID', parent: 2, child: 1 },\n            ];\n            const titleElms = _utilities__WEBPACK_IMPORTED_MODULE_0__.Element.create(elmList);\n            // console.log(titleElms);\n        }\n    }\n}\n\n\n//# sourceURL=webpack://geoai/./js/original/chat/websocket.js?");

/***/ }),

/***/ "./js/original/chat lazy recursive ^\\.\\/.*$":
/*!*******************************************************************************!*\
  !*** ./js/original/chat/ lazy ^\.\/.*$ chunkName: [request] namespace object ***!
  \*******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var map = {\n\t\"./apiClient\": [\n\t\t\"./js/original/chat/apiClient.js\",\n\t\t\"apiClient\"\n\t],\n\t\"./apiClient.js\": [\n\t\t\"./js/original/chat/apiClient.js\",\n\t\t\"apiClient\"\n\t],\n\t\"./functions\": [\n\t\t\"./js/original/chat/functions.js\"\n\t],\n\t\"./functions.js\": [\n\t\t\"./js/original/chat/functions.js\"\n\t],\n\t\"./main\": [\n\t\t\"./js/original/chat/main.js\"\n\t],\n\t\"./main.js\": [\n\t\t\"./js/original/chat/main.js\"\n\t],\n\t\"./mixins\": [\n\t\t\"./js/original/chat/mixins.js\"\n\t],\n\t\"./mixins.js\": [\n\t\t\"./js/original/chat/mixins.js\"\n\t],\n\t\"./sidebar\": [\n\t\t\"./js/original/chat/sidebar.js\"\n\t],\n\t\"./sidebar.js\": [\n\t\t\"./js/original/chat/sidebar.js\"\n\t],\n\t\"./titleActionBtn\": [\n\t\t\"./js/original/chat/titleActionBtn.js\"\n\t],\n\t\"./titleActionBtn.js\": [\n\t\t\"./js/original/chat/titleActionBtn.js\"\n\t],\n\t\"./utilities\": [\n\t\t\"./js/original/chat/utilities.js\"\n\t],\n\t\"./utilities.js\": [\n\t\t\"./js/original/chat/utilities.js\"\n\t],\n\t\"./websocket\": [\n\t\t\"./js/original/chat/websocket.js\"\n\t],\n\t\"./websocket.js\": [\n\t\t\"./js/original/chat/websocket.js\"\n\t],\n\t\"./websocketHelpers\": [\n\t\t\"./js/original/chat/websocketHelpers.js\",\n\t\t\"websocketHelpers\"\n\t],\n\t\"./websocketHelpers.js\": [\n\t\t\"./js/original/chat/websocketHelpers.js\",\n\t\t\"websocketHelpers\"\n\t]\n};\nfunction webpackAsyncContext(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\treturn Promise.resolve().then(() => {\n\t\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\t\te.code = 'MODULE_NOT_FOUND';\n\t\t\tthrow e;\n\t\t});\n\t}\n\n\tvar ids = map[req], id = ids[0];\n\treturn Promise.all(ids.slice(1).map(__webpack_require__.e)).then(() => {\n\t\treturn __webpack_require__(id);\n\t});\n}\nwebpackAsyncContext.keys = () => (Object.keys(map));\nwebpackAsyncContext.id = \"./js/original/chat lazy recursive ^\\\\.\\\\/.*$\";\nmodule.exports = webpackAsyncContext;\n\n//# sourceURL=webpack://geoai/./js/original/chat/_lazy_^\\.\\/.*$_chunkName:_%5Brequest%5D_namespace_object?");

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