import { Layer } from "./layer";
import { Drawable } from "./types/drawing";
export declare class GameObject {
    private asset;
    private x;
    private y;
    private w;
    private h;
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
