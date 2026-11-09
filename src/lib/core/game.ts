import type { AvailableModules } from "./registry";
import { createContext } from 'svelte';

export type CurrentModules = (keyof Llama.Modules extends never ? keyof AvailableModules : keyof Llama.Modules extends keyof AvailableModules ? keyof Llama.Modules : never);

export interface RequiredModules {
    size: () => [ number, number ],
    font: () => string | undefined,
    root: () => HTMLDivElement | undefined,

    on: (type: "frame" | "before" | "after", callback: (info: { delta: number, time: number }) => any | void) => () => any | void,

    // layer: (name: string) => LayerContext | null,
    // assign: (ctx: LayerContext, obj: LayerDrawable) => DestroyFunction,
    get: <T extends CurrentModules>(plugin: T) => AvailableModules[T];
}

export type ModuleInitialiser<T> = (game: Llama.GameContext) => { start: () => () => void, fetch: () => T };

export const MODULES = {
    KEYBOARD: "keyboard",
    MOUSE: "mouse",
    TIMERS: "timers",
    AUDIO: "audio",
} as const satisfies { [K in Uppercase<keyof AvailableModules>]: Lowercase<K> };

export type ModuleSetup = {
    [K in keyof AvailableModules as K extends CurrentModules ? K : never]: ModuleInitialiser<AvailableModules[K]>;
}

const [ getter, setter, hasser ] = createContext<Llama.GameContext>();
export const getGame = getter;
export const setupGame = (context: Llama.GameContext) => {
    if (hasser()) throw new Error("Cannot Mount Game inside a Game")
    setter(context);
};
