(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./controller", "./game", "./game-object", "./layer", "./animate", "./asset"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const controller_1 = require("./controller");
    const game_1 = require("./game");
    const game_object_1 = require("./game-object");
    const layer_1 = require("./layer");
    const Animate = require("./animate");
    const Asset = require("./asset");
    exports.default = {
        Game: game_1.Game,
        Layer: layer_1.Layer,
        Controller: controller_1.Controller,
        GameObject: game_object_1.GameObject,
        Animate,
        Asset
    };
});
//# sourceMappingURL=main.js.map