import { createContext, onDestroy } from "svelte";
import { getGame } from "$lib/core-contexts.js";

type SceneContext<T extends string[] = any> = {
    readonly activeScene: string,
    readonly wantedScene: string,
    readonly animationState: number,
    changeScene: (to: T[number]) => void
}

const [ getter, setter ] = createContext<SceneContext<string[]>>();

export const setupScenes = ( transition: number ) => {
    const game = getGame();
    let active = $state("default");
    let wanted = $state("default");
    const signal = game.createBurst({ duration: transition, initialTrigger: false });

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