import type { RequiredModules } from "./game.js";
import type { Timers } from "../timers/context.svelte.js";
import type { Keyboard } from "../keyboard/context.svelte.js";
import type { Mouse } from "../mouse/context.svelte.js";

export interface AvailableModules {
    keyboard: Keyboard,
    mouse: Mouse,
    timers: Timers,
    audio: () => AudioContext,
}

declare global {
    namespace Llama {
        interface Modules {}
        type GameContext = RequiredModules;
    }
}