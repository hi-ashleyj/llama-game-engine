import { ControllerEvent, ControllerAction, ControllerCallback } from "./types/controller";
export declare class Controller {
    static events: ControllerEvent[];
    static lasts: {
        [key: string]: number;
    };
    static pressed: {
        [key: string]: boolean;
    };
    static mouseLocation: {
        x?: number;
        y?: number;
    };
    static on(action: ControllerAction, target: string, callback: ControllerCallback): void;
    private static fire;
    static isPressed(code: string): boolean;
    private static handleKeyboard;
    private static handleMouse;
    static setup(): void;
}
