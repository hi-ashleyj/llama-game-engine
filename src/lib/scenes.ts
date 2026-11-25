export { 
    scenes, 
    useScenes, 
    type TransitionComponentProps, 
    type AssetLoadingMode, 
    type SceneInformation, 
    type SceneDefinition, 
    type SceneTransitionList, 
    type SceneLayerExports,
} from "./scenes/scenes.svelte.js";

export { default as SceneProvider } from "./scenes/SceneProvider.svelte";
export { default as FadeTransition } from "./scenes/Fade.svelte";

declare global {
    namespace Llama {
        /**
         * When using the scenes module, this can provide type safety by extending it with { scene: any }
         */
        interface Scenes {}
        type Scene = keyof Scenes extends never ? string : keyof Scenes;

        /**
         * When using the scenes module, this can provide type safety of transitions by extending it with { scene: any }
         */
        interface SceneTransitions {}
        type SceneTransition = keyof SceneTransitions extends never ? string : keyof SceneTransitions;
    }
}