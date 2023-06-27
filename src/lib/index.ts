export { default as Game } from "./components/Game.svelte";
export { default as Layer } from "./components/Layer.svelte";
export { default as GameObject } from "./components/GameObject.svelte";
export { default as MouseLeftClick } from "./components/mouse/MouseLeftClick.svelte";
export { default as MouseClickable } from "./components/mouse/MouseClickable.svelte";
export { default as MouseEventArea } from "./components/mouse/MouseEventArea.svelte";

export * as drawables from "./components/drawables/index.js";
export { setupDrawable, getGame, getLayer, getTriggerLayerRender } from "./setup.js";
export { resolve as resolveImage } from "./components/resources/images.js";
export { CONTROLLER_ACTION } from "./components/controller.js";
export { MOUSE_ACTION } from "./components/mouse.js";
export type { GameContext, DrawableContext, DrawableFunction, LayerContext } from "./types/index.js";