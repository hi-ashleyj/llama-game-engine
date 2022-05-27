(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Text = exports.Arc = exports.Circle = exports.Rectangle = exports.Primitive = exports.Font = exports.TileMap = exports.Image = void 0;
    class Image {
        constructor({ image, crop }) {
            this.crop = [];
            this.location = image;
            this.resource = Image.getImage(image);
            if (crop) {
                this.crop = [crop.x, crop.y, crop.width, crop.height];
            }
        }
        static getImage(uri) {
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
        static setDumpSpace(element) {
            Image.dumpspace = element;
        }
        draw(layer, x, y, w, h) {
            if (this.crop.length === 4) {
                return layer.ctx.drawImage(this.resource, ...this.crop, x, y, w, h);
            }
            layer.ctx.drawImage(this.resource, x, y, w, h);
        }
    }
    exports.Image = Image;
    Image.locations = new Map();
    Image.loading = new Set();
    class TileMap {
        constructor(image, { tiles, sizeX, sizeY }) {
            this.map = new Array(tiles).map((_ignored, i) => new Image({ image: image, crop: { x: i * sizeX, y: 0, width: sizeX, height: sizeY } }));
        }
    }
    exports.TileMap = TileMap;
    class Font {
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
            }
            else {
                this.fontFace = new FontFace(name, "url(" + uri + ")");
            }
            Font.loading.add(uri);
            this.fontFace.load().then(() => {
                Font.loading.delete(uri);
                document.fonts.add(this.fontFace);
            });
        }
    }
    exports.Font = Font;
    Font.locations = new Map();
    Font.loading = new Set();
    class Primitive {
        constructor({ fill, stroke }) {
            this.fill = fill;
            this.stroke = stroke;
        }
        draw(layer, x, y, w, h) {
            if (this.fill) {
                layer.ctx.fillStyle = this.fill;
                layer.ctx.fill();
            }
            if (this.stroke) {
                layer.ctx.strokeStyle = this.stroke;
                layer.ctx.stroke();
            }
        }
        static center(x, y, w, h) {
            return [x - (w / 2), y - (h / 2), w, h];
        }
    }
    exports.Primitive = Primitive;
    class Rectangle extends Primitive {
        constructor({ fill, stroke }) {
            super({ fill, stroke });
        }
        draw(layer, x, y, w, h) {
            layer.ctx.beginPath();
            layer.ctx.rect(x, y, w, h);
            super.draw(layer, x, y, w, h);
        }
    }
    exports.Rectangle = Rectangle;
    class Circle extends Primitive {
        constructor({ fill, stroke }) {
            super({ fill, stroke });
        }
        draw(layer, x, y, w, h) {
            layer.ctx.beginPath();
            layer.ctx.arc(x + w / 2, y + h / 2, (w + h) / 4, 0, 2 * Math.PI);
            super.draw(layer, x, y, w, h);
        }
    }
    exports.Circle = Circle;
    class Arc extends Primitive {
        constructor({ fill, stroke, angleFrom, angleTo }) {
            super({ fill, stroke });
            this.angleFrom = ((angleFrom - 90) * Math.PI / 180);
            this.angleTo = ((angleTo - 90) * Math.PI / 180);
        }
        draw(layer, x, y, w, h) {
            layer.ctx.beginPath();
            layer.ctx.arc(x + w / 2, y + h / 2, (w + h) / 4, this.angleFrom, this.angleTo);
            layer.ctx.lineTo(x + w / 2, y + h / 2);
            super.draw(layer, x, y, w, h);
        }
    }
    exports.Arc = Arc;
    class Text {
        constructor(options) {
            this.text = options.text;
            this.size = options.size;
            this.font = options.font;
            this.fill = (options.fill) ? options.fill : null;
            this.stroke = (options.stroke) ? options.stroke : null;
            this.style = (options.style) ? options.style : "";
            this.alignH = (options.alignH) ? options.alignH : "left";
            this.alignV = (options.alignV) ? options.alignV : "top";
        }
        draw(layer, x, y, w, h) {
            layer.ctx.textAlign = this.alignH;
            layer.ctx.textBaseline = this.alignV;
            layer.ctx.font = `${(this.style) ? this.style + " " : ""}${this.size}px ${this.font}`;
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
    exports.Text = Text;
});
//# sourceMappingURL=asset.js.map