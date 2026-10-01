import type { Timers } from "./controllers/motions.svelte.js";
import type { Keyboard } from "./controllers/keyboard.svelte.js";
import type { Mouse } from "./controllers/mouse.svelte.js";
import { createContext } from 'svelte';
import { setupDrawable, type DrawableContext } from './drawable.js';

export interface RequiredModules {
    size: () => [ number, number ],
    on: (type: "frame" | "before" | "after", callback: (info: { delta: number, time: number }) => any | void) => () => any | void,
    font: () => string | undefined,
    layer: (name: string) => LayerContext | null,
    assign: (ctx: LayerContext, obj: LayerDrawable) => DestroyFunction,
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

const [ getter, setter, hasser ] = createContext<Llama.GameContext>();
export const getGame = getter;
export const setupGame = (context: Llama.GameContext) => {
    if (hasser()) throw new Error("Cannot Mount Game inside a Game")
    setter(context);
};

export type LayerContext = Required<DrawableContext<null>> & {
    requestFrame: (...optional: any[]) => any;
};
const [ getLayer, setLayer, hasLayer ] = createContext<LayerContext>();

export type LayerDrawable = {
    draw: () => any | void
    isStatic: () => boolean,
    name: string
};

export const setupLayer = function (context: LayerContext): RegisterFunction<LayerDrawable> {
    if (hasLayer()) throw new Error("Cannot Mount Layer inside a Layer");
    const game = getGame();

    setLayer(context);
    setupDrawable({ assign: context.assign });

    return (obj) => {
        return game.assign(context, obj);
    }
};

export { getLayer };