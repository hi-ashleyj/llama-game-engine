import { Layer } from "./layer";
import { Drawable } from "./types/drawing";
import { TextOptions } from "./types/asset";
export declare class Image implements Drawable {
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
export declare class TileMap {
    map: Array<Image>;
    constructor(image: string, { tiles, sizeX, sizeY }: {
        tiles: number;
        sizeX: number;
        sizeY: number;
    });
}
export declare class Font {
    static locations: Map<string, boolean>;
    static loading: Set<string>;
    name: string;
    uri: string;
    features: null;
    fontFace: FontFace;
    constructor(name: any, uri: any, features: any);
}
export declare class Primitive implements Drawable {
    fill: string;
    stroke: string;
    constructor({ fill, stroke }: {
        fill?: string;
        stroke?: string;
    });
    draw(layer: Layer, x: number, y: number, w: number, h: number): void;
    static center(x: any, y: any, w: any, h: any): any[];
}
export declare class Rectangle extends Primitive {
    constructor({ fill, stroke }: {
        fill?: string;
        stroke?: string;
    });
    draw(layer: Layer, x: number, y: number, w: number, h: number): void;
}
export declare class Circle extends Primitive {
    constructor({ fill, stroke }: {
        fill?: string;
        stroke?: string;
    });
    draw(layer: Layer, x: number, y: number, w: number, h: number): void;
}
export declare class Arc extends Primitive {
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
export declare class Text implements Drawable {
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
