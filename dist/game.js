(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./controller", "./layer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Game = void 0;
    const controller_1 = require("./controller");
    const layer_1 = require("./layer");
    class Game {
        static makeElements() {
            Game.root = document.createElement("div");
            Game.root.className = "llama-game-engine game-root";
            Game.audioDumpspace = document.createElement("div");
            Game.audioDumpspace.className = "llama-game-engine game-audio-dumpspace";
            Game.audioDumpspace.hidden = true;
            Game.imagesDumpspace = document.createElement("div");
            Game.imagesDumpspace.className = "llama-game-engine game-images-dumpspace";
            Game.imagesDumpspace.hidden = true;
            document.body.appendChild(Game.root);
            document.body.appendChild(Game.audioDumpspace);
            document.body.appendChild(Game.imagesDumpspace);
            let style = document.createElement("style");
            style.innerHTML = `
            html, body {
                background: black;
                padding: 0;
                margin: 0;
                position: relative;
                overflow: hidden;
            }
            
            div.llama-game-engine.game-root {
                position: absolute;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
            }
            
            canvas.llama-game-engine.game-canvas {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        `;
            document.head.appendChild(style);
        }
        static create(options) {
            Game.width = options.width;
            Game.height = options.height;
            Game.makeElements();
            controller_1.Controller.setup();
        }
        static start() {
            window.requestAnimationFrame(Game.loop);
        }
        static wait(callback, delay) {
            Game.timeouts.add({ callback, delay });
        }
        ;
        static on(type, call) {
            Game.events.push({ type, call });
        }
        ;
        static fire(type, data) {
            for (let e of Game.events) {
                if (e.type == type) {
                    e.call((data) ? data : null);
                }
            }
        }
        ;
        static loop(time) {
            if (Game.last < 0)
                Game.last = time;
            let delta = (time - Game.last);
            if (delta > 1000) {
                window.requestAnimationFrame(Game.loop);
                return Game.last = time;
            }
            // Animate.tick(time);
            for (let timeout of Game.timeouts) {
                if (timeout.start === undefined) {
                    timeout.start = time;
                    continue;
                }
                if (time >= timeout.start + timeout.delay) {
                    timeout.callback(time - (timeout.start + timeout.delay));
                    Game.timeouts.delete(timeout);
                }
            }
            Game.fire("loop", { stamp: time, delta: delta });
            layer_1.Layer.draw();
            Game.fire("postdraw", { stamp: time, delta: delta });
            window.requestAnimationFrame(Game.loop);
            Game.last = time;
        }
        static pushCanvas(canvas) {
            Game.root.append(canvas);
        }
    }
    exports.Game = Game;
    Game.timeouts = new Set();
    Game.last = -1;
    Game.events = [];
});
//# sourceMappingURL=game.js.map