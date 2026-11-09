import { createContext } from "svelte";
import type { DrawFunction } from "./drawable";

export type LayerUpdater = (options: { name?: string, z?: number }) => void;

export type CanvasContext = {
    invalidate: (...optional: any[]) => void;
    registerLayer: (draw: DrawFunction<null>) => { update: LayerUpdater, destroy: () => void };
    layers: () => DrawFunction<null>[];
};
const [ getCanvas, setCanvas, hasCanvas ] = createContext<CanvasContext>();

export type LayerDrawable = {
    draw: () => any | void 
    isStatic: () => boolean,
    name: string
};

export const useCanvas = getCanvas;
export const useInvalidate = () => getCanvas().invalidate;
export const setupCanvas = function (context: CanvasContext) {
    if (hasCanvas()) throw new Error("Cannot Mount a Canvas inside a Canvas");

    setCanvas(context);
};