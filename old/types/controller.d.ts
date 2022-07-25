export type ControllerAction = "press" | "release" | "hold" | "click" | "move";
export type ControllerCallback = (action: ControllerAction, target: string, data: object|null) => void;

export interface ControllerEvent {
    action: ControllerAction;
    target: string;
    callback: ControllerCallback;
}