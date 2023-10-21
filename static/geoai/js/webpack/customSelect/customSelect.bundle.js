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

/***/ "./js/original/customSelect/customSelect.js":
/*!**************************************************!*\
  !*** ./js/original/customSelect/customSelect.js ***!
  \**************************************************/
/***/ (() => {

eval("function _typeof(obj) { \"@babel/helpers - typeof\"; return _typeof = \"function\" == typeof Symbol && \"symbol\" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && \"function\" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }, _typeof(obj); }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\nfunction _toPropertyKey(arg) { var key = _toPrimitive(arg, \"string\"); return _typeof(key) === \"symbol\" ? key : String(key); }\nfunction _toPrimitive(input, hint) { if (_typeof(input) !== \"object\" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || \"default\"); if (_typeof(res) !== \"object\") return res; throw new TypeError(\"@@toPrimitive must return a primitive value.\"); } return (hint === \"string\" ? String : Number)(input); }\n// Custom select element.\nvar SelectElement = /*#__PURE__*/function () {\n  function SelectElement(data) {\n    _classCallCheck(this, SelectElement);\n    this.data = data;\n    this.selectedOption = this.elm(this.data.selected);\n    this.optionsBlock; // Display/Hide the options block.\n    this.selectOption; // Handle a particular option selection.\n    this.arrowRotated = false; // Arrow toggle trucker.\n  }\n  _createClass(SelectElement, [{\n    key: \"elm\",\n    value: function elm(attr) {\n      return document.querySelector(attr);\n    }\n  }, {\n    key: \"optionsBlock\",\n    get: function get() {\n      var _this = this;\n      this.selectedOption.addEventListener('click', function () {\n        // Grab options block.\n        var options = _this.elm(_this.data.options);\n\n        // Toggle a  display of the options block.\n        options.style.display = options.style.display === 'none' || options.style.display === '' ? 'block' : 'none';\n\n        // Rotate the arrow.\n        _this.rotateArrow;\n      });\n    }\n  }, {\n    key: \"rotateArrow\",\n    get: function get() {\n      var arrow = this.elm(this.data.arrow);\n      if (this.arrowRotated) {\n        arrow.style.transform = \"rotate(0deg)\";\n      } else {\n        arrow.style.transform = \"rotate(180deg)\";\n      }\n      this.arrowRotated = !this.arrowRotated;\n    }\n  }, {\n    key: \"selectOption\",\n    get: function get() {\n      var _this2 = this;\n      // Grab all option elements.\n      document.querySelectorAll(this.data.option).forEach(function (element) {\n        _this2.optionFunc(element);\n      });\n    }\n  }, {\n    key: \"optionFunc\",\n    value: function optionFunc(element) {\n      var _this3 = this;\n      // Call function on each element.\n      element.addEventListener('click', function () {\n        // Grab current element data-value and content.\n        var value = element.getAttribute('data-value');\n        var text = element.textContent;\n\n        // Grab selected elemen span.\n        var selectedOption = _this3.elm(\"\".concat(_this3.data.selected, \" span\"));\n\n        // Set content and attribute to selected element.\n        selectedOption.textContent = text;\n        selectedOption.parentNode.setAttribute('data-value', value);\n\n        // Hide options block.\n        _this3.elm('.options').style.display = 'none';\n\n        // Submit the form element.\n        if (_this3.data.submit) _this3.submitForm(value);\n      });\n    }\n\n    // This function submits the form element which calles\n    // The django set_language view to set a language in the user session.\n  }, {\n    key: \"submitForm\",\n    value: function submitForm(value) {\n      var setLangForm = this.elm(this.data.form);\n      var currentLang = this.elm(this.data.formValue);\n      currentLang.value = value;\n      setLangForm.submit();\n    }\n  }]);\n  return SelectElement;\n}();\nwindow.SelectElement = SelectElement;\n\n//# sourceURL=webpack://geoai/./js/original/customSelect/customSelect.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./js/original/customSelect/customSelect.js"]();
/******/ 	
/******/ })()
;