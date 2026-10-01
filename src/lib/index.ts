// CORE
export { default as Game } from "./Game.svelte";
export { default as Layer } from "./Layer.svelte";
export { getGame, getLayer, getTriggerLayerRender } from "./context.js";
export type { LayerContext, LayerDrawable } from "./context.js";

export * as Scenes from "./scenes/index.js";

// CONTROLLERS
export { default as MouseClickable } from "./controllers/MouseClickable.svelte";
export { default as MouseEventArea } from "./controllers/MouseEventArea.svelte";

// DRAWABLES
export * as Drawables from "./drawables/index.js";

// RESOURCES
export * as Resource from "./resources/index.js";

// PRIMITIVES
export * as Primitives from "./primitives/index.js";

// EXTRAS
export { default as SensibleDefaultStyles } from "./extras/SensibleDefaultStyles.svelte";
export { default as LayerPortal } from "./extras/LayerPortal.svelte";
export { default as Tweened } from "./extras/Tweened.svelte";
export { default as DefaultFontFace } from "./extras/DefaultFontFace.svelte";
export { default as FullScreenEventHandler } from "./extras/FullScreenEventHandler.svelte";

// AUDIO
export { getAudioContext, getConnector as getAudioConnector, type AudioSvelteContext as LlamaAudioContext } from "./audio/context.js";
export { default as AudioListenerPosition } from "./audio/AudioListenerPosition.svelte";
export { default as MediaAudioSource } from "./audio/MediaAudioSource.svelte";
export { default as AudioGain } from "./audio/AudioGain.svelte";
export { default as AudioPanner } from "./audio/AudioPanner.svelte";
export { default as AudioCompressor } from "./audio/AudioCompressor.svelte";
export { default as AudioPosition } from "./audio/AudioPosition.svelte";