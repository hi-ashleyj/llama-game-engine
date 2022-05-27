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
//# sourceMappingURL=controller.js.map