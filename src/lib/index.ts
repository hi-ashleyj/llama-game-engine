export { default as Game } from "./components/Game.svelte";
export { default as Layer } from "./components/Layer.svelte";
export { default as GameObject } from "./components/GameObject.svelte";

export * as drawables from "./components/drawables/index";
export { setupDrawable, getGame } from "./setup";
export { resolve as resolveImage } from "./components/resources/images";
export { CONTROLLER_ACTION } from "./components/controller";
export { MOUSE_ACTION } from "./components/mouse";
export type { GameContext, DrawableContext, DrawableFunction, LayerContext } from "./types/index";