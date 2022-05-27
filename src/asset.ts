import { Layer } from "./layer";
import { Drawable } from "./types/drawing";
import { TextOptions } from "./types/asset";

export class Image implements Drawable {
    static dumpspace: HTMLDivElement;
    static locations: Map<string, HTMLImageElement> = new Map();
    static loading: Set<string> = new Set();

    private location: string;
    private readonly resource: HTMLImageElement;
    private readonly crop: [] | [number, number, number, number] = [];

    private static getImage( uri: string ): HTMLImageElement {
        if (Image.locations.has(uri)) {
            return Image.locations.get(uri);
        }

        let element = document.createElement("img");
        Image.locations.set(uri, element);
        Image.loading.add(uri);

        element.addEventListener("load", () => {
            Image.loading.delete(uri);
        });

        element.src = uri;
        Image.dumpspace.append(element);
    }

    static setDumpSpace( element: HTMLDivElement ) {
        Image.dumpspace = element;
    }

    constructor( { image, crop }: { image: string, crop?: { x: number, y: number, width: number, height: number } } ) {
        this.location = image;
        this.resource = Image.getImage(image);

        if (crop) {
            this.crop = [ crop.x, crop.y, crop.width, crop.height ];
        }
    }

    draw( layer: Layer, x: number, y: number, w: number, h: number ) {
        if (this.crop.length === 4) {
            return layer.ctx.drawImage(this.resource, ...this.crop, x, y, w, h);
        }
        layer.ctx.drawImage(this.resource, x, y, w, h);
    }
}

export class TileMap {
    map: Array<Image>;

    constructor(image: string, { tiles, sizeX, sizeY }: { tiles: number, sizeX: number, sizeY: number }) {
        this.map = new Array(tiles).map((_ignored, i) => new Image({ image: image, crop: { x: i * sizeX, y: 0, width: sizeX, height: sizeY } }));
    }
}

export class Font {
    static locations: Map<string, boolean> = new Map();
    static loading: Set<string> = new Set<string>();

    name: string;
    uri: string;
    features: null;
    fontFace: FontFace;

    constructor(name, uri, features) {
        this.name = name;
        this.uri = uri;
        this.features = features;

        if (Font.locations.has(uri)) {
            return;
        }

        if (features) {
            this.features = features;
            this.fontFace = new FontFace(name, "url(" + uri + ")", this.features);
        } else {
            this.fontFace = new FontFace(name, "url(" + uri + ")");
        }

        Font.loading.add(uri);
        this.fontFace.load().then(() => {
            Font.loading.delete(uri);
            document.fonts.add(this.fontFace);
        });
    }
}

export class Primitive implements Drawable {
    fill: string;
    stroke: string;

    constructor({ fill, stroke } : { fill?: string, stroke?: string } ) {
        this.fill = fill;
        this.stroke = stroke;
    }

    draw( layer: Layer, x: number, y: number, w: number, h: number ) {
        if (this.fill) {
            layer.ctx.fillStyle = this.fill;
            layer.ctx.fill();
        }
        if (this.stroke) {
            layer.ctx.strokeStyle = this.stroke;
            layer.ctx.stroke();
        }
    }

    static center( x, y, w, h ) {
        return [ x - (w / 2), y - (h / 2), w, h ];
    }
}

export class Rectangle extends Primitive {
    constructor({ fill, stroke } : { fill?: string, stroke?: string } ) {
        super({ fill, stroke });
    }

    draw( layer: Layer, x: number, y: number, w: number, h: number ) {
        layer.ctx.beginPath();
        layer.ctx.rect(x, y, w, h);
        super.draw(layer, x, y, w, h);
    }
}

export class Circle extends Primitive {
    constructor({ fill, stroke } : { fill?: string, stroke?: string } ) {
        super({ fill, stroke });
    }

    draw( layer: Layer, x: number, y: number, w: number, h: number ) {
        layer.ctx.beginPath();
        layer.ctx.arc(x + w / 2, y + h / 2, (w + h) / 4, 0, 2 * Math.PI);
        super.draw(layer, x, y, w, h);
    }
}

export class Arc extends Primitive {
    angleFrom: number;
    angleTo: number;

    constructor({ fill, stroke, angleFrom, angleTo } : { fill?: string, stroke?: string, angleFrom: number, angleTo: number } ) {
        super({ fill, stroke });
        this.angleFrom = ((angleFrom - 90) * Math.PI / 180);
        this.angleTo = ((angleTo - 90) * Math.PI / 180);
    }

    draw( layer: Layer, x: number, y: number, w: number, h: number ) {
        layer.ctx.beginPath();
        layer.ctx.arc(x + w / 2, y + h / 2, (w + h) / 4, this.angleFrom, this.angleTo);
        layer.ctx.lineTo(x + w / 2, y + h / 2);
        super.draw(layer, x, y, w, h);
    }
}


export class Text implements Drawable {
    text: string;
    size: number;
    private readonly font: string;
    fill: string;
    stroke: string;
    style: string;
    private readonly alignH: TextOptions["alignH"];
    private readonly alignV: TextOptions["alignV"];

    constructor(options: TextOptions) {
        this.text = options.text;
        this.size = options.size;
        this.font = options.font;
        this.fill = (options.fill) ? options.fill : null;
        this.stroke = (options.stroke) ? options.stroke : null;
        this.style = (options.style) ? options.style : "";
        this.alignH = (options.alignH) ? options.alignH : "left";
        this.alignV = (options.alignV) ? options.alignV : "top";
    }

    draw( layer: Layer, x: number, y: number, w: number, h: number ) {
        layer.ctx.textAlign = this.alignH;
        layer.ctx.textBaseline = this.alignV;
        layer.ctx.font = `${(this.style) ? this.style + " ": ""}${this.size}px ${this.font}`;
        if (this.fill) {
            layer.ctx.fillStyle = this.fill;
            layer.ctx.fillText(this.text, x, y);
        }
        if (this.stroke) {
            layer.ctx.strokeStyle = this.stroke;
            layer.ctx.strokeText(this.text, x, y);
        }
    }
}
