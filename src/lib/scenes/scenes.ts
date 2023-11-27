import { writable, get } from "svelte/store";
import type { Writable } from "svelte/store";

export const currentScene: Writable<string> = writable("default");
export const jumpSignal: Writable<boolean> = writable(false);
export const effectiveScene: Writable<string> = writable("default");
export const sceneAnimating: Writable<boolean> = writable(false);
let wasAnimating = false;

sceneAnimating.subscribe((animating) => {
    wasAnimating = animating;
    if (animating) return;
    let currentSceneValue = get(currentScene);
    if (currentSceneValue !== get(effectiveScene)) {
        changeScene(currentSceneValue);
    }
});

export const changeScene = function(scene: string) {
    currentScene.set(scene);
    if (wasAnimating) return;

    sceneAnimating.set(true);
    effectiveScene.set(scene);
}