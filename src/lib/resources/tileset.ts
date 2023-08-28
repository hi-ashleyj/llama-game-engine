import type DisplayImage from "$lib/drawables/DisplayImage.svelte";
import type { ComponentProps } from "svelte";

export type TileSet = {
    width: number;
    height: number;
    size: number;
    image: HTMLImageElement;
};

type Pixels = number;

export const useTileSet = (image: HTMLImageElement, width: number, height: number, size: Pixels) => {
    return {
        image,
        width,
        height,
        size
    } as TileSet;
}

export const getTile = (tileset: TileSet, x: number, y: number): ComponentProps<DisplayImage> => {
    if (x < 0 || y < 0) throw new Error("Cannot pick tile with index < 0");
    if (x > tileset.width || y > tileset.height) throw new Error("Cannot pick tile with index > max");
    return {
        image: tileset.image,
        crop: {
            x: x * tileset.size,
            y: y * tileset.size,
            w: tileset.size,
            h: tileset.size
        }
    };
}