"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkgeoai"] = self["webpackChunkgeoai"] || []).push([["apiClient"],{

/***/ "./js/original/chat/apiClient.js":
/*!***************************************!*\
  !*** ./js/original/chat/apiClient.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   APIClient: () => (/* binding */ APIClient)\n/* harmony export */ });\n// Get Cookies\nclass Cookie {\n    constructor(name) {\n        this.name = name;\n    }\n\n    _decodeCookie(cookie) {\n            return decodeURIComponent(cookie.split('=')[1]);\n    }\n\n    get(){\n        const cookieValue = document.cookie\n        .split('; ')\n        .find(raw => raw.startsWith(this.name + '='));\n        return cookieValue ? this._decodeCookie(cookieValue) : null;\n\n    }\n}\n\n// Deleting and updating topics.\nclass APIClient {\n    constructor(baseUrl){\n        this.baseUrl = baseUrl\n        this.cookie = new Cookie('csrftoken')\n        this.errorText = 'ვერ მოხერხდა მოთხოვნის შესრულება, გთხოვთ ცადოთ ახლიდან. ';\n    }\n\n\n    async _request(method, endpoint, data){\n        let response;\n\n        try {\n            response = await fetch(`${this.baseUrl}${endpoint}`,{\n                method: method,\n                headers: {\n                    'Content-type' : 'application/json',\n                    'x-CSRFToken': this.cookie.get(),\n                },\n                credentials: 'same-origin',\n                body: data ? JSON.stringify(data) : null\n            });\n\n        } catch (error) {\n            throw new Error(this.errorText + error)\n        }\n\n        if (!response.ok)\n            throw new Error(this.errorText + response.statusText);\n        \n        if (response.ok) {\n            if (response.status === 204){\n                return;\n            } else {\n                return response.json();\n            }\n        }\n        \n        \n    }\n\n    async update(endpoint, data) {  \n        return await this._request('PUT', endpoint, data);\n    }\n\n    async delete(endpoint) {\n        return this._request('DELETE', endpoint);\n    }\n}\n\n//# sourceURL=webpack://geoai/./js/original/chat/apiClient.js?");

/***/ })

}]);