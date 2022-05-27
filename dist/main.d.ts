import { ControllerEvent, ControllerAction, ControllerCallback } from "./types/controller";
import { Drawable } from "./types/drawing";
import { AnimatedDrawable } from "./types/animate";
import { TextOptions } from "./types/asset";
export class Controller {
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
export class GameObject {
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
export class Layer {
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
declare class Curves {
    static stamp: number;
    static targets: Set<Curves>;
    static tick(stamp: number): void;
    time: number;
    steps: {
        [percent: number]: number;
    };
    count: number;
    offset: number;
    points: number[];
    constructor(time: number, steps: {
        [percent: number]: number;
    }, count?: number);
    value(): number | null;
}
declare class AnimationSequence implements AnimatedDrawable {
    constructor(drawables: Drawable[], duration: number);
    reset(): void;
    draw(layer: Layer, x: number, y: number, w: number, h: number): void;
}
declare class AnimationSwitches implements AnimatedDrawable {
    constructor(drawables: {
        [key: string]: AnimatedDrawable;
    }, defaultDrawable: string);
    draw(layer: Layer, x: number, y: number, w: number, h: number): void;
    switch(key: string): void;
    reset(useDefault?: boolean): void;
}
export const Animate: {
    AnimationSequence: typeof AnimationSequence;
    AnimationSwitches: typeof AnimationSwitches;
    Curves: typeof Curves;
};
export class Game {
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
declare class Image implements Drawable {
    static dumpspace: HTMLDivElement;
    static locations: Map<string, HTMLImageElement>;
    static loading: Set<string>;
    static setDumpSpace(element: HTMLDivElement): void;
    constructor({ image, crop }: {
        image: string;
        crop?: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    });
    draw(layer: Layer, x: number, y: number, w: number, h: number): void;
}
declare class TileMap {
    map: Array<Image>;
    constructor(image: string, { tiles, sizeX, sizeY }: {
        tiles: number;
        sizeX: number;
        sizeY: number;
    });
}
declare class Font {
    static locations: Map<string, boolean>;
    static loading: Set<string>;
    name: string;
    uri: string;
    features: null;
    fontFace: FontFace;
    constructor(name: any, uri: any, features: any);
}
declare class Primitive implements Drawable {
    fill: string;
    stroke: string;
    constructor({ fill, stroke }: {
        fill?: string;
        stroke?: string;
    });
    draw(layer: Layer, x: number, y: number, w: number, h: number): void;
    static center(x: any, y: any, w: any, h: any): any[];
}
declare class Rectangle extends Primitive {
    constructor({ fill, stroke }: {
        fill?: string;
        stroke?: string;
    });
    draw(layer: Layer, x: number, y: number, w: number, h: number): void;
}
declare class Circle extends Primitive {
    constructor({ fill, stroke }: {
        fill?: string;
        stroke?: string;
    });
    draw(layer: Layer, x: number, y: number, w: number, h: number): void;
}
declare class Arc extends Primitive {
    angleFrom: number;
    angleTo: number;
    constructor({ fill, stroke, angleFrom, angleTo }: {
        fill?: string;
        stroke?: string;
        angleFrom: number;
        angleTo: number;
    });
    draw(layer: Layer, x: number, y: number, w: number, h: number): void;
}
declare class Text implements Drawable {
    text: string;
    size: number;
    fill: string;
    stroke: string;
    style: string;
    constructor(options: TextOptions);
    draw(layer: Layer, x: number, y: number, w: number, h: number): void;
}
export let Asset: {
    Image: typeof Image;
    Text: typeof Text;
    Arc: typeof Arc;
    Circle: typeof Circle;
    Rectangle: typeof Rectangle;
    Primitive: typeof Primitive;
    TileMap: typeof TileMap;
    Font: typeof Font;
};

//# sourceMappingURL=main.d.ts.map
