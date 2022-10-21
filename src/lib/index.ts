export { default as Game } from "./components/Game.svelte";
export { default as Layer } from "./components/Layer.svelte";
export { default as GameObject } from "./components/GameObject.svelte";

export * as drawables from "./components/drawables/index";
export { setupDrawable } from "./setup";
export { resolve as resolveImage } from "./components/resources/images";

export { Timing } from "./components/motions";