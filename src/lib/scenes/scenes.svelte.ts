import { getGame, type ModuleInitialiser } from "../core/game.js";
import { createContext, onDestroy, type Component } from "svelte";

declare global {
    namespace Llama {
        interface Scenes {}
        type Scene = keyof Scenes extends never ? string : keyof Scenes;

        interface SceneTransitions {}
        type SceneTransition = keyof SceneTransitions extends never ? string : keyof SceneTransitions;
    }
}

export type AssetLoadingMode = "only-when-required" | "lazy-when-preempted" | "optimistic-when-preempted" | "required-when-preempted"

export type SceneDefinition = {
    in: {
        transition: Llama.SceneTransition,
        duration?: number,
        loading: AssetLoadingMode,
        override?: Partial<{
            [K in Llama.Scene]: {
                transition?: Llama.SceneTransition,
                duration?: number | null,
                loading?: AssetLoadingMode
            }
        }>
    },
    out: {
        transition: Llama.SceneTransition,
        duration?: number,
        preempt: Llama.Scene[],
        override?: Partial<{
            [K in Llama.Scene]: {
                transition?: Llama.SceneTransition,
                duration?: number | null,
            }
        }>
    }
}

export type SceneInformation = {
    [K in Llama.Scene]: SceneDefinition
}

export type TransitionComponentProps = {
    t: number,
}
export type TransitionComponent = Component<TransitionComponentProps>;
export type SceneTransitionList = {
    [K in Llama.SceneTransition]: TransitionComponent;
}

export type SceneLayerProps = {
    transitioning: boolean;
}
export type SceneLayerComponent = Component<SceneLayerProps>;
export type SceneLayerExports = {
    SCENE: Llama.Scene,
    LAYER: Llama.LayerKey,
    default: SceneLayerComponent
}

type SceneContext = {
    readonly active: Llama.Scene,
    readonly from: Llama.Scene,
    readonly to: Llama.Scene,
    readonly animationState: number,
    changeScene: (to: Llama.Scene) => void
}

const [ getter, setter ] = createContext<SceneContext>();

// TODO: 
export const useScenes = getter;
export const scenes: ModuleInitialiser<SceneContext> = (ctx) => {
    let active = $state("default");
    let wanted = $state("default");
    const signal = game.timers.burst({ duration: transition, immediate: false });

    $effect(() => {
        if (wanted !== active && signal.value > 0.5) {
            active = wanted;
        }
    })

    setter({
        get activeScene() { return active },
        get wantedScene() { return wanted },
        get animationState() { return signal.value },
        changeScene: (to: string) => {
            wanted = to;
            signal.trigger();
        }
    });

    onDestroy(signal.stop);
}