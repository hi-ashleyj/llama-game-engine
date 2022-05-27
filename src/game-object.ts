import { Layer } from "./layer";
import { Drawable } from "./types/drawing";

export class GameObject {
    private asset: Drawable;
    private x: number;
    private y: number;
    private w: number;
    private h: number;

    constructor( options: { asset: Drawable, x: number, y: number, w: number, h: number } ) {
        this.asset = options.asset;
        this.x = (options.x) ? options.x : 0;
        this.y = (options.y) ? options.y : 0;
        this.w = (options.w) ? options.w : 100;
        this.h = (options.h) ? options.h : 100;
    }

    draw( layer: Layer ) {
        this.asset.draw(layer, this.x, this.y, this.w, this.h);
    }

    move( { x, y }: { x: number, y: number } ): this {
        if (typeof x === "number") this.x += x;
        if (typeof y === "number") this.y += y;
        return this;
    }

    scale( { w, h }: { w: number, h: number } ): this {
        if (typeof w === "number") this.w += w;
        if (typeof h === "number") this.h += h;
        return this;
    }

    position( { x, y, w, h }: { x: number, y: number, w: number, h: number } ) {
        if (typeof x === "number") this.x = x;
        if (typeof y === "number") this.y = y;
        if (typeof w === "number") this.w = w;
        if (typeof h === "number") this.h = h;
    }
}
