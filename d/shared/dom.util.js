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
    function whenElementReady(id, callback, timer = 200) {
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
                callback(el);
                return;
            }
            whenElementReady(id, callback, timer);
        }, timer);
    }
    exports.whenElementReady = whenElementReady;
});
//# sourceMappingURL=dom.util.js.map