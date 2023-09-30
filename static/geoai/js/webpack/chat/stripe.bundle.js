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

eval("var stripe_public_key = document.getElementById('id_stripe_publc_key').textContent.slice(1, -1);\nvar stripe_client_secret_key = document.getElementById('id_stripe_client_secret_key').textContent.slice(1, -1);\nvar stripe = Stripe(stripe_public_key);\nvar elements = stripe.elements();\nvar style = {\n  style: {\n    base: {\n      iconColor: '#c4f0ff',\n      color: '#fff',\n      fontWeight: '500',\n      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',\n      fontSize: '16px',\n      fontSmoothing: 'antialiased',\n      ':-webkit-autofill': {\n        color: '#fce883'\n      },\n      '::placeholder': {\n        color: '#87BBFD'\n      }\n    },\n    invalid: {\n      iconColor: '#FFC7EE',\n      color: '#FFC7EE'\n    }\n  }\n};\nvar card = elements.create('card', {\n  style: style\n});\ncard.mount('#card-element');\n\n// Handle realtime validation errors on the card element\ncard.addEventListener('change', function (event) {\n  var errorDiv = document.getElementById('card-errors');\n  if (event.error) {\n    var html = \"\\n            <span class=\\\"icon\\\" role=\\\"alert\\\">\\n                <i class=\\\"fas fa-times\\\"></i>\\n            </span>\\n            <span>\".concat(event.error.message, \"</span>\\n        \");\n    errorDiv.innerHTML = html;\n  } else {\n    errorDiv.textContent = '';\n  }\n});\n\n//# sourceURL=webpack://geoai/./js/original/stripe/stripe_elements.js?");

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