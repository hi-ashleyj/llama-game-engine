// CORE
export { default as Game } from "./core/Game.svelte";
export { default as Layer } from "./core/Layer.svelte";
export { default as Canvas } from "./core/Canvas.svelte";
export { setupCanvas, useCanvas, useInvalidate, useProps, type CanvasContext, type LayerUpdater } from "./core/layer-context.svelte.js";
export { setupDrawable, useDrawable, type DrawableAssign, type DrawFunction, type DrawChildren } from "./core/drawable.js";

// DRAWABLES
export * as Draw from "./primitives.js";

import type { RequiredModules } from "./core/game.js";
import type { Timers } from "./timers/context.svelte.js";
import type { Keyboard } from "./keyboard/context.svelte.js";
import type { Mouse } from "./mouse/context.svelte.js";
import type { SceneContext } from "./scenes/scenes.svelte.js";
import type { Audio } from "./audio/context.js";

export interface AvailableModules {
    keyboard: Keyboard,
    mouse: Mouse,
    timers: Timers,
    scenes: SceneContext,
    audio: Audio,
}

declare global {
    namespace Llama {
        /**
         * It should be possible to guarantee type safety when using the module system by extending this interface with { module: any }
         * This then tells typescript what you plan to bring across, which can be enforced by the compiler and no longer be optional.
         */
        interface Modules {}
        type GameContext = RequiredModules;
        
        /**
         * Extend this interface with { layer: any } to bring across type safety for the layer system
         */
        interface Layers {}
        type LayerKey = keyof Layers extends never ? string : keyof Layers;
    }
}