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
    exports.GameObject = void 0;
    class GameObject {
        constructor(options) {
            this.asset = options.asset;
            this.x = (options.x) ? options.x : 0;
            this.y = (options.y) ? options.y : 0;
            this.w = (options.w) ? options.w : 100;
            this.h = (options.h) ? options.h : 100;
        }
        draw(layer) {
            this.asset.draw(layer, this.x, this.y, this.w, this.h);
        }
        move({ x, y }) {
            if (typeof x === "number")
                this.x += x;
            if (typeof y === "number")
                this.y += y;
            return this;
        }
        scale({ w, h }) {
            if (typeof w === "number")
                this.w += w;
            if (typeof h === "number")
                this.h += h;
            return this;
        }
        position({ x, y, w, h }) {
            if (typeof x === "number")
                this.x = x;
            if (typeof y === "number")
                this.y = y;
            if (typeof w === "number")
                this.w = w;
            if (typeof h === "number")
                this.h = h;
        }
    }
    exports.GameObject = GameObject;
});
//# sourceMappingURL=game-object.js.map