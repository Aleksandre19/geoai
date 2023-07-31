/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkgeoai"] = self["webpackChunkgeoai"] || []).push([["toDo"],{

/***/ "./js/original/chat/toDo.js":
/*!**********************************!*\
  !*** ./js/original/chat/toDo.js ***!
  \**********************************/
/***/ (() => {

eval("// To do:\n// 1. New added topic title's edit action doesn't update the url in the address bar,\n//    because of the following function:\n      // if (curPage === origSlug)\n        // window.history.pushState({}, '', newUrl);\n\n// 2. Delete url from the address bar when the topic is deleted.\n\n// START 2023-07-27\n// 3. When topic title is deleted, on mouseleave the content of the deleted topic title\n      // is appended to the next topic title.\n\n// 4. There is a need to work around the updateUrl function in the titleActionBtn.js file.\n      // It seems there is a need to update titleCont storage after title deletion.\n      // Check this and fix it.\n\n// 5. wrapp ellipsis with span tag in topic title.\n// END 2023-07-27\n\n// 6. By clicking on the title edit, the ellipsis should be hidden.\n\n// ============== HEAD\n\n// 7. Refactor the titleActionBtn.js file.\n\n// 8. On removing (partialy or fully) topic title, the span in the the content is removing as well.\n\n// 9. Fixing ellipsis toggling problem on topic title.\n\n// 10. Improve OpenAI Api plugin funnctionaliity.\n\n// 11. Implement text tokinizer calculator.\n\n//# sourceURL=webpack://geoai/./js/original/chat/toDo.js?");

/***/ })

}]);