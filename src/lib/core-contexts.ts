import type { Timing } from "./controllers/motions.js";
import type { Keyboard } from "./controllers/keyboard.svelte.js";
import type { Mouse } from "./controllers/mouse.svelte.js";
import { getContext, setContext } from 'svelte';
import { setupDrawable, type DrawableContext } from './drawable.js';

export type DestroyFunction = () => any;
export type RegisterFunction<T> = (run: T) => DestroyFunction;

const GAME = Symbol();

export type GameContext = { 
    assign: (ctx: LayerContext, obj: LayerDrawable) => DestroyFunction,
    width: () => number, 
    height: () => number, 
    background: () => string,
    timer: Timing["createTimer"],
    burst: Timing["createBurst"],
    on: (type: "frame" | "before" | "after", callback: (info: { delta: number, time: number }) => any | void) => () => any,
    onKeyboard: Keyboard["on"],
    onMouse: Mouse["on"],
    keyboard: Keyboard["info"],
    mouse: Mouse["info"],
    layer: (name: string) => LayerContext | null,
    font: (set?: string | null) => string | null,
    audio: () => AudioContext
} ;

export const setupGame = function (context: GameContext) {
    if (getContext(GAME)) {
        throw new Error("Cannot Mount Game inside a Game");
    }

    setContext<GameContext>(GAME, context);
};

export const getGame = function() {
    return getContext<GameContext>(GAME);
};

const LAYER = Symbol();

export type LayerContext = Required<DrawableContext<null>> & {
    requestFrame: (...optional: any[]) => any;
};

export type LayerDrawable = {
    draw: () => any | void
    isStatic: () => boolean,
    name: string
};

export const setupLayer = function (context: LayerContext): RegisterFunction<LayerDrawable> {
    if (getContext(LAYER)) {
        throw new Error("Cannot Mount Layer inside a Layer");
    }
    const game = getContext(GAME) as GameContext | undefined;
    if (!game) throw new Error("Layers must be inside a Game");
    setContext(LAYER, context);

    setupDrawable({ assign: context.assign });

    return (obj) => {
        return game.assign(context, obj);
    }
};

export const getLayer = function() {
    let layer = getContext<LayerContext>(LAYER);
    if (!layer) throw new Error("Layer context does not exist!");
    return layer;
};

export const getTriggerLayerRender = function() {
    let layer = getLayer();
    return layer.requestFrame;
};