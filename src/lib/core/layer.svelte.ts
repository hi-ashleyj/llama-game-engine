import { createContext } from "svelte";
import type { DrawFunction } from "./drawable.js";

declare global {
    namespace Llama {
        interface Layers {}
        type LayerKey = keyof Layers extends never ? string : keyof Layers;
    }
}

export type LayerUpdater = (options: { name?: Llama.LayerKey, z?: number }) => void;

export type CanvasContext = {
    invalidate: (...optional: any[]) => void;
    changed: (...optional: any[]) => void;
    registerLayer: (draw: DrawFunction<null>) => { update: LayerUpdater, destroy: () => void };
    layers: () => DrawFunction<null>[];
};
const [ getCanvas, setCanvas, hasCanvas ] = createContext<CanvasContext>();

export const useCanvas = getCanvas;
export const useInvalidate = () => getCanvas().invalidate;
export const useProps = <T extends object>(props: () => T) => {
    const invalid = getCanvas().changed;

    const _props = props() as Record<string, any>;
    for (let k in _props) {
        $effect(() => invalid(_props[k]));
    }
}

export const setupCanvas = function (context: CanvasContext) {
    if (hasCanvas()) throw new Error("Cannot Mount a Canvas inside a Canvas");

    setCanvas(context);
};