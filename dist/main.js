define("game-object", ["require", "exports"], function (require, exports) {
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
define("controller", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    class Controller {
        static on(action, target, callback) {
            Controller.events.push({ action, target, callback });
        }
        static fire(action, target, data) {
            Controller.events.forEach(event => {
                if (event.action && event.action !== action)
                    return;
                if (event.target && event.target !== target)
                    return;
                event.callback(action, target, (data) ? data : null);
            });
        }
        static isPressed(code) {
            return Controller.pressed[code];
        }
        static handleKeyboard(e) {
            let target = "key_" + e.key.toLowerCase();
            switch (e.type) {
                case ("keydown"): {
                    if (Controller.pressed[target])
                        return;
                    Controller.pressed[target] = true;
                    Controller.lasts[target] = e.timeStamp;
                    return Controller.fire("press", target);
                }
                case ("keyup"): {
                    if (!Controller.pressed[target])
                        return;
                    Controller.pressed[target] = false;
                    Controller.lasts[target] = e.timeStamp;
                    Controller.fire("release", target);
                    let diff = e.timeStamp - Controller.lasts[target];
                    Controller.fire("hold", target, { diff });
                    if (diff <= 150) {
                        return Controller.fire("click", target);
                    }
                }
            }
        }
        static handleMouse(e) {
            let target = "mouse_" + ((e.button) ? ["left", "middle", "right", "back", "forward"][e.button] : "moose");
            if (e.clientX && e.clientY) {
                if (Controller.mouseLocation.x && Controller.mouseLocation.y) {
                    let deltaX = e.clientX - Controller.mouseLocation.x;
                    let deltaY = e.clientY - Controller.mouseLocation.y;
                    Controller.fire("move", "mouse_location", { x: e.clientX, y: e.clientY, deltaX, deltaY });
                }
                Controller.mouseLocation.x = e.clientX;
                Controller.mouseLocation.y = e.clientY;
            }
            switch (e.type) {
                case ("wheel"): {
                    let direction = "";
                    if (e.deltaY < 0) {
                        direction += "N";
                    }
                    else if (e.deltaY > 0) {
                        direction += "S";
                    }
                    if (e.deltaX < 0) {
                        direction += "W";
                    }
                    else if (e.deltaX > 0) {
                        direction += "E";
                    }
                    return Controller.fire("move", "mouse_wheel", { direction, deltaX: e.deltaX, deltaY: e.deltaY });
                }
                case ("mousedown"): {
                    if (Controller.pressed[target])
                        return;
                    Controller.pressed[target] = true;
                    Controller.lasts[target] = e.timeStamp;
                    return Controller.fire("press", target);
                }
                case ("mouseup"): {
                    if (!Controller.pressed[target])
                        return;
                    Controller.pressed[target] = false;
                    Controller.lasts[target] = e.timeStamp;
                    Controller.fire("release", target);
                    let diff = e.timeStamp - Controller.lasts[target];
                    Controller.fire("hold", target, { diff });
                    if (diff <= 150) {
                        return Controller.fire("click", target);
                    }
                }
            }
        }
        static setup() {
            document.addEventListener("mousedown", Controller.handleMouse, false);
            document.addEventListener("mouseup", Controller.handleMouse, false);
            document.addEventListener("mousemove", Controller.handleMouse, false);
            document.addEventListener("wheel", Controller.handleMouse, false);
            document.addEventListener("keydown", Controller.handleKeyboard, false);
            document.addEventListener("keyup", Controller.handleKeyboard, false);
        }
    }
    exports.Controller = Controller;
    Controller.events = [];
    Controller.lasts = {};
    Controller.pressed = {};
    Controller.mouseLocation = {};
});
define("game", ["require", "exports", "controller", "layer"], function (require, exports, controller_1, layer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Game = void 0;
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
define("layer", ["require", "exports", "game"], function (require, exports, game_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Layer = void 0;
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
define("animate", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AnimationSwitches = exports.AnimationSequence = exports.Curves = void 0;
    class Curves {
        constructor(time, steps, count) {
            this.offset = -1;
            this.time = time;
            this.steps = steps;
            this.count = (count) ? count : Infinity;
            this.points = Object.keys(steps).map(key => parseFloat(key)).sort((a, b) => a - b);
            Curves.targets.add(this);
        }
        static tick(stamp) {
            Curves.stamp = stamp;
        }
        value() {
            if (this.points.length < 2)
                return null;
            if (this.offset < 0)
                this.offset = Curves.stamp;
            let duration = Curves.stamp - this.offset;
            if (Math.floor(duration / this.time) >= this.count)
                return null;
            let factor = duration % this.time / this.time;
            for (let i = 1; i < this.points.length; i++) {
                if (this.points[i] >= factor) {
                    let to = this.points[i];
                    let from = this.points[i - 1];
                    let percent = (factor - from) / (to - from);
                    return this.steps[from] + (this.steps[to] - this.steps[from]) * percent;
                }
            }
        }
    }
    exports.Curves = Curves;
    Curves.stamp = -1;
    Curves.targets = new Set();
    class AnimationSequence {
        constructor(drawables, duration) {
            this.drawables = [];
            this.drawables = drawables;
            this.duration = duration;
            this.reset();
        }
        reset() {
            this.timing = new Curves(this.duration, {
                0: 0,
                1: this.drawables.length
            });
        }
        draw(layer, x, y, w, h) {
            this.drawables[this.timing.value()].draw(layer, x, y, w, h);
        }
    }
    exports.AnimationSequence = AnimationSequence;
    class AnimationSwitches {
        constructor(drawables, defaultDrawable) {
            this.drawables = drawables;
            this.default = defaultDrawable;
            this.use = defaultDrawable;
        }
        draw(layer, x, y, w, h) {
            this.drawables[this.use].draw(layer, x, y, w, h);
        }
        switch(key) {
            if (this.use === key)
                return;
            this.use = key;
            this.drawables[this.use].reset();
        }
        reset(useDefault = false) {
            if (useDefault)
                this.use = this.default;
            this.drawables[this.use].reset();
        }
    }
    exports.AnimationSwitches = AnimationSwitches;
});
define("asset", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Text = exports.Arc = exports.Circle = exports.Rectangle = exports.Primitive = exports.Font = exports.TileMap = exports.Image = void 0;
    class Image {
        constructor({ image, crop }) {
            this.crop = [];
            this.location = image;
            this.resource = Image.getImage(image);
            if (crop) {
                this.crop = [crop.x, crop.y, crop.width, crop.height];
            }
        }
        static getImage(uri) {
            if (Image.locations.has(uri)) {
                return Image.locations.get(uri);
            }
            let element = document.createElement("img");
            Image.locations.set(uri, element);
            Image.loading.add(uri);
            element.addEventListener("load", () => {
                Image.loading.delete(uri);
            });
            element.src = uri;
            Image.dumpspace.append(element);
        }
        static setDumpSpace(element) {
            Image.dumpspace = element;
        }
        draw(layer, x, y, w, h) {
            if (this.crop.length === 4) {
                return layer.ctx.drawImage(this.resource, ...this.crop, x, y, w, h);
            }
            layer.ctx.drawImage(this.resource, x, y, w, h);
        }
    }
    exports.Image = Image;
    Image.locations = new Map();
    Image.loading = new Set();
    class TileMap {
        constructor(image, { tiles, sizeX, sizeY }) {
            this.map = new Array(tiles).map((_ignored, i) => new Image({ image: image, crop: { x: i * sizeX, y: 0, width: sizeX, height: sizeY } }));
        }
    }
    exports.TileMap = TileMap;
    class Font {
        constructor(name, uri, features) {
            this.name = name;
            this.uri = uri;
            this.features = features;
            if (Font.locations.has(uri)) {
                return;
            }
            if (features) {
                this.features = features;
                this.fontFace = new FontFace(name, "url(" + uri + ")", this.features);
            }
            else {
                this.fontFace = new FontFace(name, "url(" + uri + ")");
            }
            Font.loading.add(uri);
            this.fontFace.load().then(() => {
                Font.loading.delete(uri);
                document.fonts.add(this.fontFace);
            });
        }
    }
    exports.Font = Font;
    Font.locations = new Map();
    Font.loading = new Set();
    class Primitive {
        constructor({ fill, stroke }) {
            this.fill = fill;
            this.stroke = stroke;
        }
        draw(layer, x, y, w, h) {
            if (this.fill) {
                layer.ctx.fillStyle = this.fill;
                layer.ctx.fill();
            }
            if (this.stroke) {
                layer.ctx.strokeStyle = this.stroke;
                layer.ctx.stroke();
            }
        }
        static center(x, y, w, h) {
            return [x - (w / 2), y - (h / 2), w, h];
        }
    }
    exports.Primitive = Primitive;
    class Rectangle extends Primitive {
        constructor({ fill, stroke }) {
            super({ fill, stroke });
        }
        draw(layer, x, y, w, h) {
            layer.ctx.beginPath();
            layer.ctx.rect(x, y, w, h);
            super.draw(layer, x, y, w, h);
        }
    }
    exports.Rectangle = Rectangle;
    class Circle extends Primitive {
        constructor({ fill, stroke }) {
            super({ fill, stroke });
        }
        draw(layer, x, y, w, h) {
            layer.ctx.beginPath();
            layer.ctx.arc(x + w / 2, y + h / 2, (w + h) / 4, 0, 2 * Math.PI);
            super.draw(layer, x, y, w, h);
        }
    }
    exports.Circle = Circle;
    class Arc extends Primitive {
        constructor({ fill, stroke, angleFrom, angleTo }) {
            super({ fill, stroke });
            this.angleFrom = ((angleFrom - 90) * Math.PI / 180);
            this.angleTo = ((angleTo - 90) * Math.PI / 180);
        }
        draw(layer, x, y, w, h) {
            layer.ctx.beginPath();
            layer.ctx.arc(x + w / 2, y + h / 2, (w + h) / 4, this.angleFrom, this.angleTo);
            layer.ctx.lineTo(x + w / 2, y + h / 2);
            super.draw(layer, x, y, w, h);
        }
    }
    exports.Arc = Arc;
    class Text {
        constructor(options) {
            this.text = options.text;
            this.size = options.size;
            this.font = options.font;
            this.fill = (options.fill) ? options.fill : null;
            this.stroke = (options.stroke) ? options.stroke : null;
            this.style = (options.style) ? options.style : "";
            this.alignH = (options.alignH) ? options.alignH : "left";
            this.alignV = (options.alignV) ? options.alignV : "top";
        }
        draw(layer, x, y, w, h) {
            layer.ctx.textAlign = this.alignH;
            layer.ctx.textBaseline = this.alignV;
            layer.ctx.font = `${(this.style) ? this.style + " " : ""}${this.size}px ${this.font}`;
            if (this.fill) {
                layer.ctx.fillStyle = this.fill;
                layer.ctx.fillText(this.text, x, y);
            }
            if (this.stroke) {
                layer.ctx.strokeStyle = this.stroke;
                layer.ctx.strokeText(this.text, x, y);
            }
        }
    }
    exports.Text = Text;
});
define("main", ["require", "exports", "controller", "game", "game-object", "layer", "animate", "asset"], function (require, exports, controller_2, game_2, game_object_1, layer_2, Animate, Asset) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        Game: game_2.Game,
        Layer: layer_2.Layer,
        Controller: controller_2.Controller,
        GameObject: game_object_1.GameObject,
        Animate,
        Asset
    };
});
//# sourceMappingURL=main.js.map