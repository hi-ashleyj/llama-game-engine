import { createContext, onDestroy } from "svelte";
import { getGame } from "$lib/context.js";

declare global {
    namespace Llama {
        interface Scenes {}
        type Scene = keyof Scenes extends never ? string : keyof Scenes;
    }
}

type SceneContext = {
    readonly activeScene: Llama.Scene,
    readonly wantedScene: Llama.Scene,
    readonly animationState: number,
    changeScene: (to: Llama.Scene) => void
}

const [ getter, setter ] = createContext<SceneContext>();

export const setupScenes = ( transition: number ) => {
    const game = getGame();
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

export const useScenes = getter;