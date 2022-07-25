import { ControllerEvent, ControllerAction, ControllerCallback } from "./types/controller";

export class Controller {
    static events: ControllerEvent[] = [];
    static lasts: { [key: string]: number } = {};
    static pressed: { [key: string]: boolean } = {};
    static mouseLocation: { x?: number, y?: number } = {};

    static on(action: ControllerAction, target: string, callback: ControllerCallback): void {
        Controller.events.push({ action, target, callback });
    }

    private static fire(action: ControllerAction, target: string, data?: object): void {
        Controller.events.forEach(event => {
            if (event.action && event.action !== action) return;
            if (event.target && event.target !== target) return;
            event.callback(action, target, (data) ? data : null);
        });
    }

    static isPressed(code: string): boolean {
        return Controller.pressed[code];
    }

    private static handleKeyboard(e) {
        let target = "key_" + e.key.toLowerCase();
        switch (e.type) {
            case ("keydown"): {
                if (Controller.pressed[target]) return;

                Controller.pressed[target] = true;
                Controller.lasts[target] = e.timeStamp;
                return Controller.fire("press", target);
            }
            case ("keyup"): {
                if (!Controller.pressed[target]) return;

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

    private static handleMouse(e) {
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
                } else if (e.deltaY > 0) {
                    direction += "S";
                }

                if (e.deltaX < 0) {
                    direction += "W";
                } else if (e.deltaX > 0) {
                    direction += "E";
                }

                return Controller.fire("move", "mouse_wheel", { direction, deltaX: e.deltaX, deltaY: e.deltaY });
            }
            case ("mousedown"): {
                if (Controller.pressed[target]) return;

                Controller.pressed[target] = true;
                Controller.lasts[target] = e.timeStamp;
                return Controller.fire("press", target);
            }
            case ("mouseup"): {
                if (!Controller.pressed[target]) return;

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

    static setup(): void {
        document.addEventListener("mousedown", Controller.handleMouse, false);
        document.addEventListener("mouseup", Controller.handleMouse, false);
        document.addEventListener("mousemove", Controller.handleMouse, false);
        document.addEventListener("wheel", Controller.handleMouse, false);

        document.addEventListener("keydown", Controller.handleKeyboard, false);
        document.addEventListener("keyup", Controller.handleKeyboard, false);
    }
}
