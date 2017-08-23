(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const extensionId = 'pmfanodcfkjkbikblghiieinjgmpmdjk';
    function getItem(key) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(extensionId, { command: 'getItem', data: { key: key } }, response => {
                resolve(response);
            });
        });
    }
    exports.getItem = getItem;
    function setItem(key, value) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(extensionId, { command: 'setItem', data: { key: key, value: value } }, response => {
                resolve(response);
            });
        });
    }
    exports.setItem = setItem;
    function removeItem(key) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(extensionId, { command: 'removeItem', data: { key: key } }, response => {
                resolve(response);
            });
        });
    }
    exports.removeItem = removeItem;
});
//# sourceMappingURL=store.util.js.map