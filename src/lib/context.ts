import type { Timers } from "./controllers/motions.svelte.js";
import type { Keyboard } from "./controllers/keyboard.svelte.js";
import type { Mouse } from "./controllers/mouse.svelte.js";
import { getContext, setContext, createContext } from 'svelte';
import { setupDrawable, type DrawableContext } from './drawable.js';

export interface RequiredModules {
    size: () => [ number, number ],
    on: (type: "frame" | "before" | "after", callback: (info: { delta: number, time: number }) => any | void) => () => any | void,
    font: () => string | undefined,
    layer: (name: string) => LayerContext | null,
}

export interface AvailableModules {
    keyboard: Keyboard,
    mouse: Mouse,
    timers: Timers,
    audio: () => AudioContext,
}

export const MODULES = {
    KEYBOARD: "keyboard",
    MOUSE: "mouse",
    TIMERS: "timers",
    AUDIO: "audio",
} as const satisfies { [K in Uppercase<keyof AvailableModules>]: Lowercase<K> }; 

declare global {
    namespace Llama {
        interface Modules {}
        
        type GameContext = {
            [K in (keyof AvailableModules | keyof RequiredModules)]: K extends keyof RequiredModules ? (RequiredModules[K]) : (K extends keyof AvailableModules ? ( K extends (keyof Modules extends never ? string : keyof Modules) ? AvailableModules[K] : never ) : never);
        };
    }
}

export type DestroyFunction = () => any;
export type RegisterFunction<T> = (run: T) => DestroyFunction;

const GAME = Symbol();

// export type GameContext = { 
//     assign: (ctx: LayerContext, obj: LayerDrawable) => DestroyFunction,
//     size: () => [ number, number ],
//     timer: Timing["createTimer"],
//     burst: Timing["createBurst"],
//     on: (type: "frame" | "before" | "after", callback: (info: { delta: number, time: number }) => any | void) => () => any,
//     onMouse: Mouse["on"],
//     keyboard: Keyboard,
//     mouse: Mouse["info"],
//     layer: (name: string) => LayerContext | null,
//     font: (set?: string | null) => string | null,
//     audio: () => AudioContext
// };

const [ getter, setter ] = createContext<Llama.GameContext>();

export const setupGame = function (context: Llama.GameContext) {
    if (getContext(GAME)) {
        throw new Error("Cannot Mount Game inside a Game");
    }

    setContext<Llama.GameContext>(GAME, context);
};

export const getGame = function() {
    return getContext<Llama.GameContext>(GAME);
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
    const game = getContext(GAME) as Llama.GameContext | undefined;
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