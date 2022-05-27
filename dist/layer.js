(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./game"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Layer = void 0;
    const game_1 = require("./game");
    class Layer {
        constructor(id, options) {
            this.targets = new Set();
            if (!id) {
                throw new Error('Layer id is required');
            }
            if (Layer.list.has(id)) {
                return Layer.list.get(id);
            }
            this.id = id;
            this.options = options;
            if (!game_1.Game.width || !game_1.Game.height) {
                throw new Error('Game not created yet');
            }
            this.width = game_1.Game.width;
            this.height = game_1.Game.height;
            this.canvas = document.createElement('canvas');
            this.canvas.width = game_1.Game.width;
            this.canvas.height = game_1.Game.height;
            this.canvas.style.zIndex = options.level.toString();
            this.canvas.className = "llama-game-engine game-canvas";
            this.ctx = this.canvas.getContext('2d');
            this.ctx.imageSmoothingEnabled = false;
            game_1.Game.pushCanvas(this.canvas);
            Layer.list.set(id, this);
        }
        assign(...targets) {
            for (const target of targets) {
                this.targets.add(target);
            }
            return this;
        }
        remove(...targets) {
            for (const target of targets) {
                this.targets.delete(target);
            }
            return this;
        }
        purge() {
            this.targets.clear();
        }
        draw() {
            this.ctx.clearRect(0, 0, this.width, this.height);
            for (const target of this.targets) {
                target.draw(this);
            }
        }
        static draw() {
            Layer.list.forEach(layer => {
                layer.draw();
            });
        }
        static purge() {
            Layer.list.forEach(layer => {
                layer.purge();
            });
        }
    }
    exports.Layer = Layer;
    Layer.list = new Map();
});
//# sourceMappingURL=layer.js.map