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

/***/ "./js/original/stripe/stripe_elements.js":
/*!***********************************************!*\
  !*** ./js/original/stripe/stripe_elements.js ***!
  \***********************************************/
/***/ (() => {

eval("var stripe_public_key = document.getElementById('id_stripe_publc_key').textContent.slice(1, -1);\nvar stripe_client_secret_key = document.getElementById('id_stripe_client_secret_key').textContent.slice(1, -1);\nvar stripe = Stripe(stripe_public_key);\nvar elements = stripe.elements();\nvar card = elements.create('card');\ncard.mount('#stripe-elements-div');\n\n//# sourceURL=webpack://geoai/./js/original/stripe/stripe_elements.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./js/original/stripe/stripe_elements.js"]();
/******/ 	
/******/ })()
;