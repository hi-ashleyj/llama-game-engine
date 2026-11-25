import type { ModuleInitialiser } from "../core/game.js";
import { createContext, type Component } from "svelte";

export type AssetLoadingMode = "never" | "only-when-required" | "lazy-when-preempted" | "optimistic-when-preempted" | "required-when-preempted"

export type TransitionConfig = {
    transition: Llama.SceneTransition | null,
    duration?: number,
    override?: Partial<{
        [K in Llama.Scene]: {
            transition?: Llama.SceneTransition,
            duration?: number | null,
        }
    }>
}

export type ResolvedTransition = Required<Omit<TransitionConfig, "override">>;

export const resolveTransition = (transition: TransitionConfig, alt: Llama.Scene | null): ResolvedTransition => {
    if (!alt || !transition.override || !transition.override[alt]) {
        return {
            transition: transition.transition ?? null,
            duration: transition.duration ?? 0,
        }
    };
    const override = transition.override[alt];
    return {
        transition: override.transition ?? transition.transition ?? null,
        duration: override.duration ?? transition.duration ?? 0,
    }
}

export type SceneDefinition = {
    in: {
        transition: Llama.SceneTransition | null,
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
        transition: Llama.SceneTransition | null,
        duration?: number,
        preempt?: Llama.Scene[],
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

export type SceneContext = {
    readonly from: Llama.Scene | null,
    readonly to: Llama.Scene | null,
    changeScene: (to: Llama.Scene) => void,
    touch: (to: Llama.Scene) => void,
}

const [ getter, setter ] = createContext<SceneContext>();

// TODO: 
export const useScenes = getter;
export const scenes: ModuleInitialiser<SceneContext> = () => {
    let from: Llama.Scene | null = $state(null);
    let to: Llama.Scene | null = $state(null);

    const context: SceneContext = {
        changeScene: (scene) => {
            if (to === from && scene !== from) to = scene;
            if (from === null) from = "" + scene;
        },
        touch: (scene) => {
            if (to !== from && scene === from) from = "" + scene;
        },
        get from() {
            return from;
        },
        get to() {
            return to;
        }
    }

    setter(context);

    return {
        fetch: getter,
        start: () => {
            return () => null;
        }
    }

}