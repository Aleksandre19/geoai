"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkgeoai"] = self["webpackChunkgeoai"] || []).push([["functions"],{

/***/ "./js/original/chat/functions.js":
/*!***************************************!*\
  !*** ./js/original/chat/functions.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Func: () => (/* binding */ Func),\n/* harmony export */   leaveActBtn: () => (/* binding */ leaveActBtn)\n/* harmony export */ });\n/* harmony import */ var _mixins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mixins */ \"./js/original/chat/mixins.js\");\n/* harmony import */ var _titleActionBtn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./titleActionBtn */ \"./js/original/chat/titleActionBtn.js\");\n\n\n\n\n// Functions used acrose the application.\nclass leaveActBtn {\n    static hide(titleWrapper) {\n        titleWrapper.removeEventListener('click', _mixins__WEBPACK_IMPORTED_MODULE_0__.Prevent.click);\n        const wrapperID = titleWrapper.id.split('-')['1']; // <li id='li-{{topic.id}}'>\n        const titleElm = document.getElementById(`title-${wrapperID}`);\n        const titleSpan = titleElm.querySelector(`span.title-span`) // <a href=\"{% url 'topic' topic.slug %}\"...\n        const titleContent = titleSpan.textContent;\n        const titleElipsis = titleElm.querySelector(`span.title-ellipsis`); \n        titleSpan.style.cursor = 'pointer';\n        titleSpan.contentEditable = 'false';\n        titleSpan.removeEventListener('click', _mixins__WEBPACK_IMPORTED_MODULE_0__.Prevent.click);\n\n        // If `deletion` was triggerd by clickin on trash icon, \n        // and then leaving current title without confirming it\n        // the title content will be restored on the `mouseleace` event.\n        const curActions = ['delete']; // Click on trash icon.\n        if (curActions.includes(_titleActionBtn__WEBPACK_IMPORTED_MODULE_1__.titleAct.get))\n            titleSpan.textContent = _titleActionBtn__WEBPACK_IMPORTED_MODULE_1__.titleCont.get;\n            _titleActionBtn__WEBPACK_IMPORTED_MODULE_1__.titleAct.clear;\n        \n        const actBtnElm = titleWrapper.querySelector('.act-btn-confirm');\n        const linkElm = titleWrapper.querySelector('.title-link');\n        actBtnElm.classList.remove('display-act-btn-confirm')\n        linkElm.blur();\n    }\n};\n\n\n// This class runes the function from the array.\n// export class Func {\n//     static async execute(funcs, curClasse) {\n//         funcs.forEach(async (actions) => {\n//             if (!actions[curClasse]) return;\n\n//             for (const action of actions[curClasse]) {\n//                 console.log(action);\n//                 await action();\n//             }\n//         });\n//     }\n// } \n\n// This class runs the function from the array.\nclass Func {\n    static async execute(funcs, curClasse) {\n        for (const actions of funcs) {\n            if (!actions[curClasse]) continue;\n\n            for (const action of actions[curClasse]) {\n                await action();\n            }\n        }\n    }\n}\n\n\n//# sourceURL=webpack://geoai/./js/original/chat/functions.js?");

/***/ })

}]);