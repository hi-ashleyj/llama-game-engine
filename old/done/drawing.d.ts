import { Layer } from "../layer";

export interface Drawable {
    draw(layer: Layer, x: number, y: number, w: number, h: number): void;
}