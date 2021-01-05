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

let Asset = {};
Asset.list = {};



let Player = {};

let Scene = {};



let Layer = function(id) {


    return this;
};

