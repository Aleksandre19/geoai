"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkgeoai"] = self["webpackChunkgeoai"] || []).push([["topicTitleActions"],{

/***/ "./js/original/chat/topicTitleActions.js":
/*!***********************************************!*\
  !*** ./js/original/chat/topicTitleActions.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   topicTitleActions: () => (/* binding */ topicTitleActions)\n/* harmony export */ });\nfunction topicTitleActions(e) {\n    const target = e.target; // Get current element\n    const classNames = target.className.split(\" \"); // Grab current element's class attributes\n    const currentElm = classNames[classNames.length - 1]; // Current element's class name\n    // If action is deletion\n    if(currentElm == 'geoai-trash-icon'){\n        // Add alert text to deletion.\n        const actBtn = target.parentNode.nextElementSibling;\n        actBtn.querySelector('.confirm-msg').textContent = 'წავშალო?';\n\n        // Hide action buttons and open confirmation dialog box\n        target.parentNode.classList.add('hide-element'); // class='topic-title-act-btn'\n        const nextSibling = target.parentNode.nextElementSibling; // class='act-btn-confirm'\n        nextSibling.classList.add('display-act-btn-confirm'); // Display confirmation container\n\n    // If action is closing current action\n    }else if (currentElm == 'geoai-x-icon'){\n        target.parentNode.classList.remove('display-act-btn-confirm'); // class='act-btn-confirm'\n        const prevSibling = target.parentNode.previousElementSibling; // class='topic-title-act-btn'\n        prevSibling.classList.remove('hide-element');\n\n        // If action is editions of topic title\n    } else if (currentElm == 'geoai-edit-icon') {\n        // Topic title 'a' element\n        const topicTitle = target.parentNode.parentNode.previousElementSibling;    \n        const nextSibling = target.parentNode.nextElementSibling; // class='act-btn-confirm'\n        // Grab message element\n        const actMsg = nextSibling.querySelector(`p.confirm-msg`); // class='confirm-msg'\n        // Display action buttons\n        nextSibling.classList.add('display-act-btn-confirm');\n        // Add title content to action's message\n        actMsg.textContent = topicTitle.textContent.trim();\n        // Make editable message element\n        actMsg.contentEditable = true; // class='confirm-msg'\n        // Auto focus message element\n        actMsg.focus(); // class='confirm-msg'\n    }\n}\n\n//# sourceURL=webpack://geoai/./js/original/chat/topicTitleActions.js?");

/***/ })

}]);