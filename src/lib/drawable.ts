import { getContext, setContext } from "svelte";
import type { RegisterFunction } from "./core-contexts.d.ts";

const DRAWABLE = Symbol();

export type DrawableContext<Options> = {
    assign?: RegisterFunction<DrawableObject<Options>>
}

export type DrawableObject<Options> = {
    draw: DrawFunction<Options>
}

export type CoreLayerOptions = {
    width: number,
    height: number,
    ctx: CanvasRenderingContext2D,
}

export type DrawFunction<Options> = Options extends null ? (core: CoreLayerOptions ) => void | any : (core: CoreLayerOptions, more: Options) => void | any;

export const setupDrawable = function<TParent, TChildren> ({ assign }: DrawableContext<TChildren>): RegisterFunction<DrawableObject<TParent>> {
    let parent = getContext<Required<DrawableContext<TParent>>>(DRAWABLE);

    if (assign) {
        setContext<Required<DrawableContext<TChildren>>>(DRAWABLE, { assign });
    }

    return (obj) => {
        if (!parent) return () => {};
        return parent.assign(obj);
    }
};