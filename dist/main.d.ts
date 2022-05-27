import { ControllerEvent, ControllerAction, ControllerCallback } from "./types/controller";
import { Drawable } from "./types/drawing";
declare class Controller {
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
    static isPressed(code: string): boolean;
    static setup(): void;
}
declare class GameObject {
    constructor(options: {
        asset: Drawable;
        x: number;
        y: number;
        w: number;
        h: number;
    });
    draw(layer: Layer): void;
    move({ x, y }: {
        x: number;
        y: number;
    }): this;
    scale({ w, h }: {
        w: number;
        h: number;
    }): this;
    position({ x, y, w, h }: {
        x: number;
        y: number;
        w: number;
        h: number;
    }): void;
}
declare class Layer {
    static list: Map<string, Layer>;
    readonly width: number;
    readonly height: number;
    ctx: CanvasRenderingContext2D;
    constructor(id: string, options: {
        level: number;
    });
    assign(...targets: GameObject[]): this;
    remove(...targets: GameObject[]): this;
    purge(): void;
    draw(): void;
    static draw(): void;
    static purge(): void;
}
declare class Game {
    static width: number;
    static height: number;
    static timeouts: Set<{
        callback: (after: number) => void;
        delay: number;
        start?: number;
    }>;
    static last: number;
    static events: {
        type: string;
        call: Function;
    }[];
    static create(options: {
        width: number;
        height: number;
    }): void;
    static start(): void;
    static wait(callback: (after: number) => void, delay: number): void;
    static on(type: string, call: Function): void;
    static fire(type: any, data: any): void;
    static loop(time: DOMHighResTimeStamp): number;
    static pushCanvas(canvas: HTMLCanvasElement): void;
}
export const Llama: {
    Game: typeof Game;
    Layer: typeof Layer;
    Controller: typeof Controller;
    GameObject: typeof GameObject;
    Animate: typeof Animate;
    Asset: typeof Asset;
};

//# sourceMappingURL=main.d.ts.map
