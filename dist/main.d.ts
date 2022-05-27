declare module "game-object" {
    import { Layer } from "layer";
    import { Drawable } from "./types/drawing";
    export class GameObject {
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
}
declare module "controller" {
    import { ControllerEvent, ControllerAction, ControllerCallback } from "./types/controller";
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
        private static fire;
        static isPressed(code: string): boolean;
        private static handleKeyboard;
        private static handleMouse;
        static setup(): void;
    }
}
declare module "game" {
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
        private static root;
        private static audioDumpspace;
        private static imagesDumpspace;
        private static makeElements;
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
}
declare module "layer" {
    import { GameObject } from "game-object";
    export class Layer {
        static list: Map<string, Layer>;
        private id;
        private readonly canvas;
        private readonly options;
        readonly width: number;
        readonly height: number;
        private targets;
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
}
declare module "animate" {
    import { Layer } from "layer";
    import { Drawable } from "./types/drawing";
    import { AnimatedDrawable } from "./types/animate";
    export class Curves {
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
    export class AnimationSequence implements AnimatedDrawable {
        private readonly drawables;
        private timing;
        private readonly duration;
        constructor(drawables: Drawable[], duration: number);
        reset(): void;
        draw(layer: Layer, x: number, y: number, w: number, h: number): void;
    }
    export class AnimationSwitches implements AnimatedDrawable {
        private readonly drawables;
        private use;
        private readonly default;
        constructor(drawables: {
            [key: string]: AnimatedDrawable;
        }, defaultDrawable: string);
        draw(layer: Layer, x: number, y: number, w: number, h: number): void;
        switch(key: string): void;
        reset(useDefault?: boolean): void;
    }
}
declare module "asset" {
    import { Layer } from "layer";
    import { Drawable } from "./types/drawing";
    import { TextOptions } from "./types/asset";
    export class Image implements Drawable {
        static dumpspace: HTMLDivElement;
        static locations: Map<string, HTMLImageElement>;
        static loading: Set<string>;
        private location;
        private readonly resource;
        private readonly crop;
        private static getImage;
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
    export class TileMap {
        map: Array<Image>;
        constructor(image: string, { tiles, sizeX, sizeY }: {
            tiles: number;
            sizeX: number;
            sizeY: number;
        });
    }
    export class Font {
        static locations: Map<string, boolean>;
        static loading: Set<string>;
        name: string;
        uri: string;
        features: null;
        fontFace: FontFace;
        constructor(name: any, uri: any, features: any);
    }
    export class Primitive implements Drawable {
        fill: string;
        stroke: string;
        constructor({ fill, stroke }: {
            fill?: string;
            stroke?: string;
        });
        draw(layer: Layer, x: number, y: number, w: number, h: number): void;
        static center(x: any, y: any, w: any, h: any): any[];
    }
    export class Rectangle extends Primitive {
        constructor({ fill, stroke }: {
            fill?: string;
            stroke?: string;
        });
        draw(layer: Layer, x: number, y: number, w: number, h: number): void;
    }
    export class Circle extends Primitive {
        constructor({ fill, stroke }: {
            fill?: string;
            stroke?: string;
        });
        draw(layer: Layer, x: number, y: number, w: number, h: number): void;
    }
    export class Arc extends Primitive {
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
    export class Text implements Drawable {
        text: string;
        size: number;
        private readonly font;
        fill: string;
        stroke: string;
        style: string;
        private readonly alignH;
        private readonly alignV;
        constructor(options: TextOptions);
        draw(layer: Layer, x: number, y: number, w: number, h: number): void;
    }
}
declare module "main" {
    import { Controller } from "controller";
    import { Game } from "game";
    import { GameObject } from "game-object";
    import { Layer } from "layer";
    import * as Animate from "animate";
    import * as Asset from "asset";
    const _default: {
        Game: typeof Game;
        Layer: typeof Layer;
        Controller: typeof Controller;
        GameObject: typeof GameObject;
        Animate: typeof Animate;
        Asset: typeof Asset;
    };
    export default _default;
}
