// CORE
export { default as Game } from "./core/Game.svelte";
export { default as Layer } from "./core/Layer.svelte";
export { default as Canvas } from "./core/Canvas.svelte";
export { setupCanvas, useCanvas, useInvalidate, type CanvasContext, type LayerUpdater, type LayerDrawable } from "./core/layer.js";
export { setupDrawable, useDrawable, type DrawableAssign, type DrawFunction, type DrawChildren } from "./core/drawable.js";

// export * as Scenes from "./scenes/index.js";

// DRAWABLES
export * as Draw from "./primitive.js";

// RESOURCES
// export * as Resource from "./resources/index.js";

// EXTRAS
// export { default as SensibleDefaultStyles } from "./extras/SensibleDefaultStyles.svelte";
// export { default as LayerPortal } from "./extras/LayerPortal.svelte";
// export { default as Tweened } from "./extras/Tweened.svelte";
// export { default as FullScreenEventHandler } from "./extras/FullScreenEventHandler.svelte";