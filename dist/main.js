class $edb0ad70e86925e1$export$bd0bf19f25da8474 {
    static events = [];
    static lasts = {};
    static pressed = {};
    static mouseLocation = {};
    static on(action, target, callback) {
        $edb0ad70e86925e1$export$bd0bf19f25da8474.events.push({
            action: action,
            target: target,
            callback: callback
        });
    }
    static fire(action, target, data) {
        $edb0ad70e86925e1$export$bd0bf19f25da8474.events.forEach((event)=>{
            if (event.action && event.action !== action) return;
            if (event.target && event.target !== target) return;
            event.callback(action, target, data ? data : null);
        });
    }
    static isPressed(code) {
        return $edb0ad70e86925e1$export$bd0bf19f25da8474.pressed[code];
    }
    static handleKeyboard(e) {
        let target = "key_" + e.key.toLowerCase();
        switch(e.type){
            case "keydown":
                if ($edb0ad70e86925e1$export$bd0bf19f25da8474.pressed[target]) return;
                $edb0ad70e86925e1$export$bd0bf19f25da8474.pressed[target] = true;
                $edb0ad70e86925e1$export$bd0bf19f25da8474.lasts[target] = e.timeStamp;
                return $edb0ad70e86925e1$export$bd0bf19f25da8474.fire("press", target);
            case "keyup":
                {
                    if (!$edb0ad70e86925e1$export$bd0bf19f25da8474.pressed[target]) return;
                    $edb0ad70e86925e1$export$bd0bf19f25da8474.pressed[target] = false;
                    $edb0ad70e86925e1$export$bd0bf19f25da8474.lasts[target] = e.timeStamp;
                    $edb0ad70e86925e1$export$bd0bf19f25da8474.fire("release", target);
                    let diff = e.timeStamp - $edb0ad70e86925e1$export$bd0bf19f25da8474.lasts[target];
                    $edb0ad70e86925e1$export$bd0bf19f25da8474.fire("hold", target, {
                        diff: diff
                    });
                    if (diff <= 150) return $edb0ad70e86925e1$export$bd0bf19f25da8474.fire("click", target);
                }
        }
    }
    static handleMouse(e) {
        let target = "mouse_" + (e.button ? [
            "left",
            "middle",
            "right",
            "back",
            "forward"
        ][e.button] : "moose");
        if (e.clientX && e.clientY) {
            if ($edb0ad70e86925e1$export$bd0bf19f25da8474.mouseLocation.x && $edb0ad70e86925e1$export$bd0bf19f25da8474.mouseLocation.y) {
                let deltaX = e.clientX - $edb0ad70e86925e1$export$bd0bf19f25da8474.mouseLocation.x;
                let deltaY = e.clientY - $edb0ad70e86925e1$export$bd0bf19f25da8474.mouseLocation.y;
                $edb0ad70e86925e1$export$bd0bf19f25da8474.fire("move", "mouse_location", {
                    x: e.clientX,
                    y: e.clientY,
                    deltaX: deltaX,
                    deltaY: deltaY
                });
            }
            $edb0ad70e86925e1$export$bd0bf19f25da8474.mouseLocation.x = e.clientX;
            $edb0ad70e86925e1$export$bd0bf19f25da8474.mouseLocation.y = e.clientY;
        }
        switch(e.type){
            case "wheel":
                {
                    let direction = "";
                    if (e.deltaY < 0) direction += "N";
                    else if (e.deltaY > 0) direction += "S";
                    if (e.deltaX < 0) direction += "W";
                    else if (e.deltaX > 0) direction += "E";
                    return $edb0ad70e86925e1$export$bd0bf19f25da8474.fire("move", "mouse_wheel", {
                        direction: direction,
                        deltaX: e.deltaX,
                        deltaY: e.deltaY
                    });
                }
            case "mousedown":
                if ($edb0ad70e86925e1$export$bd0bf19f25da8474.pressed[target]) return;
                $edb0ad70e86925e1$export$bd0bf19f25da8474.pressed[target] = true;
                $edb0ad70e86925e1$export$bd0bf19f25da8474.lasts[target] = e.timeStamp;
                return $edb0ad70e86925e1$export$bd0bf19f25da8474.fire("press", target);
            case "mouseup":
                {
                    if (!$edb0ad70e86925e1$export$bd0bf19f25da8474.pressed[target]) return;
                    $edb0ad70e86925e1$export$bd0bf19f25da8474.pressed[target] = false;
                    $edb0ad70e86925e1$export$bd0bf19f25da8474.lasts[target] = e.timeStamp;
                    $edb0ad70e86925e1$export$bd0bf19f25da8474.fire("release", target);
                    let diff = e.timeStamp - $edb0ad70e86925e1$export$bd0bf19f25da8474.lasts[target];
                    $edb0ad70e86925e1$export$bd0bf19f25da8474.fire("hold", target, {
                        diff: diff
                    });
                    if (diff <= 150) return $edb0ad70e86925e1$export$bd0bf19f25da8474.fire("click", target);
                }
        }
    }
    static setup() {
        document.addEventListener("mousedown", $edb0ad70e86925e1$export$bd0bf19f25da8474.handleMouse, false);
        document.addEventListener("mouseup", $edb0ad70e86925e1$export$bd0bf19f25da8474.handleMouse, false);
        document.addEventListener("mousemove", $edb0ad70e86925e1$export$bd0bf19f25da8474.handleMouse, false);
        document.addEventListener("wheel", $edb0ad70e86925e1$export$bd0bf19f25da8474.handleMouse, false);
        document.addEventListener("keydown", $edb0ad70e86925e1$export$bd0bf19f25da8474.handleKeyboard, false);
        document.addEventListener("keyup", $edb0ad70e86925e1$export$bd0bf19f25da8474.handleKeyboard, false);
    }
}


class $971351ec61e49235$export$7fc05a3731226b90 {
    static stamp = -1;
    static targets = new Set();
    static tick(stamp) {
        $971351ec61e49235$export$7fc05a3731226b90.stamp = stamp;
    }
    offset = -1;
    constructor(time, steps, count){
        this.time = time;
        this.steps = steps;
        this.count = count ? count : Infinity;
        this.points = Object.keys(steps).map((key)=>parseFloat(key)).sort((a, b)=>a - b);
        $971351ec61e49235$export$7fc05a3731226b90.targets.add(this);
    }
    value() {
        if (this.points.length < 2) return null;
        if (this.offset < 0) this.offset = $971351ec61e49235$export$7fc05a3731226b90.stamp;
        let duration = $971351ec61e49235$export$7fc05a3731226b90.stamp - this.offset;
        if (Math.floor(duration / this.time) >= this.count) return null;
        let factor = duration % this.time / this.time;
        for(let i = 1; i < this.points.length; i++)if (this.points[i] >= factor) {
            let to = this.points[i];
            let from = this.points[i - 1];
            let percent = (factor - from) / (to - from);
            return this.steps[from] + (this.steps[to] - this.steps[from]) * percent;
        }
    }
}
class $971351ec61e49235$export$44710f68374d3da8 {
    drawables = [];
    constructor(drawables, duration){
        this.drawables = drawables;
        this.duration = duration;
        this.reset();
    }
    reset() {
        this.timing = new $971351ec61e49235$export$7fc05a3731226b90(this.duration, {
            0: 0,
            1: this.drawables.length
        });
    }
    draw(layer, x, y, w, h) {
        this.drawables[this.timing.value()].draw(layer, x, y, w, h);
    }
}
class $971351ec61e49235$export$e90425c1fce4da58 {
    constructor(drawables, defaultDrawable){
        this.drawables = drawables;
        this.default = defaultDrawable;
        this.use = defaultDrawable;
    }
    draw(layer, x, y, w, h) {
        this.drawables[this.use].draw(layer, x, y, w, h);
    }
    switch(key) {
        if (this.use === key) return;
        this.use = key;
        this.drawables[this.use].reset();
    }
    reset(useDefault = false) {
        if (useDefault) this.use = this.default;
        this.drawables[this.use].reset();
    }
}
const $971351ec61e49235$export$83a1293bbde53b95 = {
    AnimationSequence: $971351ec61e49235$export$44710f68374d3da8,
    AnimationSwitches: $971351ec61e49235$export$e90425c1fce4da58,
    Curves: $971351ec61e49235$export$7fc05a3731226b90
};
var $971351ec61e49235$export$2e2bcd8739ae039 = $971351ec61e49235$export$83a1293bbde53b95;




class $df9966d71ee61f6e$export$936d0764594b6eb3 {
    static list = new Map();
    targets = new Set();
    constructor(id, options){
        if (!id) throw new Error("Layer id is required");
        if ($df9966d71ee61f6e$export$936d0764594b6eb3.list.has(id)) return $df9966d71ee61f6e$export$936d0764594b6eb3.list.get(id);
        this.id = id;
        this.options = options;
        if (!(0, $8aaa40018df40525$export$985739bfa5723e08).width || !(0, $8aaa40018df40525$export$985739bfa5723e08).height) throw new Error("Game not created yet");
        this.width = (0, $8aaa40018df40525$export$985739bfa5723e08).width;
        this.height = (0, $8aaa40018df40525$export$985739bfa5723e08).height;
        this.canvas = document.createElement("canvas");
        this.canvas.width = (0, $8aaa40018df40525$export$985739bfa5723e08).width;
        this.canvas.height = (0, $8aaa40018df40525$export$985739bfa5723e08).height;
        this.canvas.style.zIndex = options.level.toString();
        this.canvas.className = "llama-game-engine game-canvas";
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        (0, $8aaa40018df40525$export$985739bfa5723e08).pushCanvas(this.canvas);
        $df9966d71ee61f6e$export$936d0764594b6eb3.list.set(id, this);
    }
    assign(...targets) {
        for (const target of targets)this.targets.add(target);
        return this;
    }
    remove(...targets) {
        for (const target of targets)this.targets.delete(target);
        return this;
    }
    purge() {
        this.targets.clear();
    }
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (const target of this.targets)target.draw(this);
    }
    static draw() {
        $df9966d71ee61f6e$export$936d0764594b6eb3.list.forEach((layer)=>{
            layer.draw();
        });
    }
    static purge() {
        $df9966d71ee61f6e$export$936d0764594b6eb3.list.forEach((layer)=>{
            layer.purge();
        });
    }
}


class $8aaa40018df40525$export$985739bfa5723e08 {
    static timeouts = new Set();
    static last = -1;
    static events = [];
    static makeElements() {
        $8aaa40018df40525$export$985739bfa5723e08.root = document.createElement("div");
        $8aaa40018df40525$export$985739bfa5723e08.root.className = "llama-game-engine game-root";
        $8aaa40018df40525$export$985739bfa5723e08.audioDumpspace = document.createElement("div");
        $8aaa40018df40525$export$985739bfa5723e08.audioDumpspace.className = "llama-game-engine game-audio-dumpspace";
        $8aaa40018df40525$export$985739bfa5723e08.audioDumpspace.hidden = true;
        $8aaa40018df40525$export$985739bfa5723e08.imagesDumpspace = document.createElement("div");
        $8aaa40018df40525$export$985739bfa5723e08.imagesDumpspace.className = "llama-game-engine game-images-dumpspace";
        $8aaa40018df40525$export$985739bfa5723e08.imagesDumpspace.hidden = true;
        document.body.appendChild($8aaa40018df40525$export$985739bfa5723e08.root);
        document.body.appendChild($8aaa40018df40525$export$985739bfa5723e08.audioDumpspace);
        document.body.appendChild($8aaa40018df40525$export$985739bfa5723e08.imagesDumpspace);
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
        $8aaa40018df40525$export$985739bfa5723e08.width = options.width;
        $8aaa40018df40525$export$985739bfa5723e08.height = options.height;
        $8aaa40018df40525$export$985739bfa5723e08.makeElements();
        (0, $edb0ad70e86925e1$export$bd0bf19f25da8474).setup();
    }
    static start() {
        window.requestAnimationFrame($8aaa40018df40525$export$985739bfa5723e08.loop);
    }
    static wait(callback, delay) {
        $8aaa40018df40525$export$985739bfa5723e08.timeouts.add({
            callback: callback,
            delay: delay
        });
    }
    static on(type, call) {
        $8aaa40018df40525$export$985739bfa5723e08.events.push({
            type: type,
            call: call
        });
    }
    static fire(type, data) {
        for (let e of $8aaa40018df40525$export$985739bfa5723e08.events)if (e.type == type) e.call(data ? data : null);
    }
    static loop(time) {
        if ($8aaa40018df40525$export$985739bfa5723e08.last < 0) $8aaa40018df40525$export$985739bfa5723e08.last = time;
        let delta = time - $8aaa40018df40525$export$985739bfa5723e08.last;
        if (delta > 1000) {
            window.requestAnimationFrame($8aaa40018df40525$export$985739bfa5723e08.loop);
            return $8aaa40018df40525$export$985739bfa5723e08.last = time;
        }
        (0, $971351ec61e49235$export$2e2bcd8739ae039).Curves.tick(time);
        for (let timeout of $8aaa40018df40525$export$985739bfa5723e08.timeouts){
            if (timeout.start === undefined) {
                timeout.start = time;
                continue;
            }
            if (time >= timeout.start + timeout.delay) {
                timeout.callback(time - (timeout.start + timeout.delay));
                $8aaa40018df40525$export$985739bfa5723e08.timeouts.delete(timeout);
            }
        }
        $8aaa40018df40525$export$985739bfa5723e08.fire("loop", {
            stamp: time,
            delta: delta
        });
        (0, $df9966d71ee61f6e$export$936d0764594b6eb3).draw();
        $8aaa40018df40525$export$985739bfa5723e08.fire("postdraw", {
            stamp: time,
            delta: delta
        });
        window.requestAnimationFrame($8aaa40018df40525$export$985739bfa5723e08.loop);
        $8aaa40018df40525$export$985739bfa5723e08.last = time;
    }
    static pushCanvas(canvas) {
        $8aaa40018df40525$export$985739bfa5723e08.root.append(canvas);
    }
}


class $6e2679f058a662f2$export$434da80b31429dcb {
    constructor(options){
        this.asset = options.asset;
        this.x = options.x ? options.x : 0;
        this.y = options.y ? options.y : 0;
        this.w = options.w ? options.w : 100;
        this.h = options.h ? options.h : 100;
    }
    draw(layer) {
        this.asset.draw(layer, this.x, this.y, this.w, this.h);
    }
    move({ x: x , y: y  }) {
        if (typeof x === "number") this.x += x;
        if (typeof y === "number") this.y += y;
        return this;
    }
    scale({ w: w , h: h  }) {
        if (typeof w === "number") this.w += w;
        if (typeof h === "number") this.h += h;
        return this;
    }
    position({ x: x , y: y , w: w , h: h  }) {
        if (typeof x === "number") this.x = x;
        if (typeof y === "number") this.y = y;
        if (typeof w === "number") this.w = w;
        if (typeof h === "number") this.h = h;
    }
}




class $19600059415940a9$export$3e431a229df88919 {
    static locations = new Map();
    static loading = new Set();
    crop = [];
    static getImage(uri) {
        if ($19600059415940a9$export$3e431a229df88919.locations.has(uri)) return $19600059415940a9$export$3e431a229df88919.locations.get(uri);
        let element = document.createElement("img");
        $19600059415940a9$export$3e431a229df88919.locations.set(uri, element);
        $19600059415940a9$export$3e431a229df88919.loading.add(uri);
        element.addEventListener("load", ()=>{
            $19600059415940a9$export$3e431a229df88919.loading.delete(uri);
        });
        element.src = uri;
        $19600059415940a9$export$3e431a229df88919.dumpspace.append(element);
    }
    static setDumpSpace(element) {
        $19600059415940a9$export$3e431a229df88919.dumpspace = element;
    }
    constructor({ image: image , crop: crop  }){
        this.location = image;
        this.resource = $19600059415940a9$export$3e431a229df88919.getImage(image);
        if (crop) this.crop = [
            crop.x,
            crop.y,
            crop.width,
            crop.height
        ];
    }
    draw(layer, x, y, w, h) {
        if (this.crop.length === 4) return layer.ctx.drawImage(this.resource, ...this.crop, x, y, w, h);
        layer.ctx.drawImage(this.resource, x, y, w, h);
    }
}
class $19600059415940a9$export$16ec26812de3ce7a {
    constructor(image, { tiles: tiles , sizeX: sizeX , sizeY: sizeY  }){
        this.map = new Array(tiles).map((_ignored, i)=>new $19600059415940a9$export$3e431a229df88919({
                image: image,
                crop: {
                    x: i * sizeX,
                    y: 0,
                    width: sizeX,
                    height: sizeY
                }
            }));
    }
}
class $19600059415940a9$export$89abf52a030e56ee {
    static locations = new Map();
    static loading = new Set();
    constructor(name, uri, features){
        this.name = name;
        this.uri = uri;
        this.features = features;
        if ($19600059415940a9$export$89abf52a030e56ee.locations.has(uri)) return;
        if (features) {
            this.features = features;
            this.fontFace = new FontFace(name, "url(" + uri + ")", this.features);
        } else this.fontFace = new FontFace(name, "url(" + uri + ")");
        $19600059415940a9$export$89abf52a030e56ee.loading.add(uri);
        this.fontFace.load().then(()=>{
            $19600059415940a9$export$89abf52a030e56ee.loading.delete(uri);
            document.fonts.add(this.fontFace);
        });
    }
}
class $19600059415940a9$export$250ffa63cdc0d034 {
    constructor({ fill: fill , stroke: stroke  }){
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
        return [
            x - w / 2,
            y - h / 2,
            w,
            h
        ];
    }
}
class $19600059415940a9$export$4617fb02663045ef extends $19600059415940a9$export$250ffa63cdc0d034 {
    constructor({ fill: fill , stroke: stroke  }){
        super({
            fill: fill,
            stroke: stroke
        });
    }
    draw(layer, x, y, w, h) {
        layer.ctx.beginPath();
        layer.ctx.rect(x, y, w, h);
        super.draw(layer, x, y, w, h);
    }
}
class $19600059415940a9$export$c89a927ffc67e6fa extends $19600059415940a9$export$250ffa63cdc0d034 {
    constructor({ fill: fill , stroke: stroke  }){
        super({
            fill: fill,
            stroke: stroke
        });
    }
    draw(layer, x, y, w, h) {
        layer.ctx.beginPath();
        layer.ctx.arc(x + w / 2, y + h / 2, (w + h) / 4, 0, 2 * Math.PI);
        super.draw(layer, x, y, w, h);
    }
}
class $19600059415940a9$export$6ef80ffb606dd232 extends $19600059415940a9$export$250ffa63cdc0d034 {
    constructor({ fill: fill , stroke: stroke , angleFrom: angleFrom , angleTo: angleTo  }){
        super({
            fill: fill,
            stroke: stroke
        });
        this.angleFrom = (angleFrom - 90) * Math.PI / 180;
        this.angleTo = (angleTo - 90) * Math.PI / 180;
    }
    draw(layer, x, y, w, h) {
        layer.ctx.beginPath();
        layer.ctx.arc(x + w / 2, y + h / 2, (w + h) / 4, this.angleFrom, this.angleTo);
        layer.ctx.lineTo(x + w / 2, y + h / 2);
        super.draw(layer, x, y, w, h);
    }
}
class $19600059415940a9$export$5f1af8db9871e1d6 {
    constructor(options){
        this.text = options.text;
        this.size = options.size;
        this.font = options.font;
        this.fill = options.fill ? options.fill : null;
        this.stroke = options.stroke ? options.stroke : null;
        this.style = options.style ? options.style : "";
        this.alignH = options.alignH ? options.alignH : "left";
        this.alignV = options.alignV ? options.alignV : "top";
    }
    draw(layer, x, y, w, h) {
        layer.ctx.textAlign = this.alignH;
        layer.ctx.textBaseline = this.alignV;
        layer.ctx.font = `${this.style ? this.style + " " : ""}${this.size}px ${this.font}`;
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
let $19600059415940a9$export$c413dd039085b182 = {
    Image: $19600059415940a9$export$3e431a229df88919,
    Text: $19600059415940a9$export$5f1af8db9871e1d6,
    Arc: $19600059415940a9$export$6ef80ffb606dd232,
    Circle: $19600059415940a9$export$c89a927ffc67e6fa,
    Rectangle: $19600059415940a9$export$4617fb02663045ef,
    Primitive: $19600059415940a9$export$250ffa63cdc0d034,
    TileMap: $19600059415940a9$export$16ec26812de3ce7a,
    Font: $19600059415940a9$export$89abf52a030e56ee
};
var $19600059415940a9$export$2e2bcd8739ae039 = $19600059415940a9$export$c413dd039085b182;




export {$edb0ad70e86925e1$export$bd0bf19f25da8474 as Controller, $8aaa40018df40525$export$985739bfa5723e08 as Game, $6e2679f058a662f2$export$434da80b31429dcb as GameObject, $df9966d71ee61f6e$export$936d0764594b6eb3 as Layer, $971351ec61e49235$export$83a1293bbde53b95 as Animate, $19600059415940a9$export$c413dd039085b182 as Asset};
//# sourceMappingURL=main.js.map
