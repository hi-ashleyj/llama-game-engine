let Game = {};

let Controller = {};
Controller.events = [];
Controller.lasts = {};
Controller.pressed = {};
Controller.mouse = {};
Controller.mouse.location = {};

Controller.on = function(action, target, call) {
    Controller.events.push({ action, target, call });
};

Controller.fire = function(action, target, data) {
    for (let i in Controller.events) {
        if ((!Controller.events[i].target || Controller.events[i].target == target) && (!Controller.events[i].action || Controller.events[i].action == action)) {
            Controller.events[i].call(action, target, (data) ? data : null);
        }
    }
};

Controller.isPressed = function(code) {
    return Controller.pressed[code];
}

Controller.handleKeyboard = function(e) {
    let target = "key_" + e.key.toLowerCase();
    if (e.type == "keydown") {
        if (!Controller.pressed[target]) {
            Controller.pressed[target] = true;
            Controller.lasts[target] = e.timeStamp;
            Controller.fire("press", target);
        }
    } else if (e.type == "keyup") {
        if (Controller.pressed[target]) {
            Controller.pressed[target] = false;
            let diff = e.timeStamp - Controller.lasts[target];

            if (diff <= 150) {
                Controller.fire("click", target);
            } else {
                Controller.fire("hold", target, diff);
            }

            Controller.lasts[target] = e.timeStamp;
            Controller.fire("release", target);
        }
    }
};

Controller.handleMouse = function(e) {
    let target = "mouse_" + ((e.button) ? ["left", "middle", "right", "back", "forward"][e.button] : "moose");
    e.preventDefault();
    if (e.type == "mousedown") {
        if (!Controller.pressed[target]) {
            Controller.pressed[target] = true;
            Controller.lasts[target] = e.timeStamp;
            Controller.fire("press", target);
        }
    } else if (e.type == "mouseup") {
        if (Controller.pressed[target]) {
            Controller.pressed[target] = false;
            let diff = e.timeStamp - Controller.lasts[target];

            if (diff <= 150) {
                Controller.fire("click", target);
            } else {
                Controller.fire("hold", target, diff);
            }

            Controller.lasts[target] = e.timeStamp;
            Controller.fire("release", target);
        }
    }
    if (e.clientX && e.clientY) {
        let deltaX = e.clientX - Controller.mouse.location.x;
        let deltaY = e.clientY - Controller.mouse.location.y;

        Controller.fire("move", "mouse_location", { x: e.clientX, y: e.clientY, deltaX, deltaY });

        Controller.mouse.location.x = e.clientX;
        Controller.mouse.location.y = e.clientY;
    }
    if (e.type == "wheel") {
        let direction = "";
        if (e.deltaY < 0) {
            direction += "N";
        } else if (e.deltaY > 0) {
            direction += "S";
        }

        if (e.deltaX < 0) {
            direction += "W";
        } else if (e.deltaX > 0) {
            direction += "E";
        }

        Controller.fire("move", "mouse_wheel", { direction, deltaX: e.deltaX, deltaY: e.deltaY });
    }
};

Controller.setup = function() {
    document.addEventListener("mousedown", Controller.handleMouse, false);
    document.addEventListener("mouseup", Controller.handleMouse, false);
    document.addEventListener("mousemove", Controller.handleMouse, false);
    document.addEventListener("wheel", Controller.handleMouse, false);

    document.addEventListener("keydown", Controller.handleKeyboard, false);
    document.addEventListener("keyup", Controller.handleKeyboard, false);
};

let Asset = function(id, options) {
    if (options.image) {
        this.type = "image";
        this.location = options.image;
        if (Asset.locations[this.location]) {
            this.resource = Asset.locations[this.location];
        } else {
            // TODO: Add getter code
        }
        if (options.crop) {
            this.crop = [options.crop.x, options.crop.y, options.crop.w, options.crop.h];
        }
        
    } else if (options.primitive) {
        if (options.primitive == "rectangle") {
            this.type = "rect";
        } else if (options.primitive == "circle") {
            this.type = "arc";
            this.arcAngleS = 0;
            this.arcAngleE = 2 * Math.PI;
        } else if (options.primitive == "arc") {
            this.type = "arc";
            this.arcAngleS = ((options.angleFrom - 90) * Math.PI / 180);
            this.arcAngleE = ((options.angleTo - 90) * Math.PI / 180);
        }

        this.fill = (options.fill) ? options.fill : null;
        this.stroke = (options.stroke) ? options.stroke : null;
    }

    if (options.crop) {
        this.crop = [options.crop.x, options.crop.y, options.crop.w, options.crop.h];
    }

    if (options.layer) {
        this.layer = options.layer;
    }

    if (options.raw) {
        Object.assign(this, options.raw);
    }

    if (options.update) {
        Object.assign(this, options.update);
    }

    this.id = id;

    Asset.list[id] = this;
    return this;
};

Asset.list = {};
Asset.loading = [];
Asset.locations = {};

Asset.get = function(id) {
    return Asset.list[id];
};

Asset.center = function(x, y, w, h) {
    return [x - (w / 2), y - (h / 2), w, h];
};

Asset.prototype.draw = function(x, y, w, h) {
    switch (this.type) {
        case ("image"): {
            if (this.crop) {
                this.layer.ctx.image(this.resource, ...this.crop, x, y, w, h);
            } else {
                this.layer.ctx.image(this.resource, x, y, w, h);
            }
        }
        case ("rect"): {
            if (this.fill) {
                this.layer.ctx.fillStyle = this.fill;
                this.layer.ctx.fillRect(x, y, w, h);
            }
            if (this.stroke) {
                this.layer.ctx.fillStyle = this.stroke;
                this.layer.ctx.strokeRect(x, y, w, h);
            }
        }
        case ("arc"): {
            this.layer.ctx.beginPath();
            this.layer.ctx.arc(x, y, (w + h) / 4, this.arcAngleS, this.arcAngleE);
            if (this.fill) {
                this.layer.ctx.fillStyle = this.fill;
                this.layer.ctx.fill();
            }
            if (this.stroke) {
                this.layer.ctx.fillStyle = this.stroke;
                this.layer.ctx.stroke();
            }
        }
    }
};

Asset.prototype.clone = function(id, changes) {
    return new Asset(id, { raw: this, update: changes });
};

let Player = {};

let Scene = {};

let Sound = function(layer, description, asset) {
    // TODO: handle converting asset into something playable
};

let Layer = function(id, options) {
    if (!Game.width || !Game.height) {
        throw "Game not created yet";
    }
    let john = document.createElement("canvas");
    john.className = "game-canvas";
    john.style.zIndex = options.level;
    document.querySelector("div#game").append(john);

    this.id = id;
    this.level = options.level;
    this.canvas = john;
    this.ctx = this.canvas.getContext("2d");

    return this;
};

Layer.prototype.add = function(asset) {
    asset.layer = this;
    return this;
};



Game.create = function(options) {
    Game.width = options.width;
    Game.height = options.height;

    Controller.setup();
}