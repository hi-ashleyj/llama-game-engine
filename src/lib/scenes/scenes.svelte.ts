import { createContext, onDestroy } from "svelte";
import { getGame } from "$lib/core-contexts.js";

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
    const signal = game.burst({ duration: transition, initialTrigger: false });

    let current = $state(1);
    signal.subscribe((v) => {
        if (wanted !== active && v > 0.5) {
            active = wanted;
        }
        current = v;
    })

    setter({
        get activeScene() { return active },
        get wantedScene() { return wanted },
        get animationState() { return current },
        changeScene: (to: string) => {
            wanted = to;
            signal.trigger();
        }
    });

    onDestroy(signal.stop);
}

export const useScenes = getter;