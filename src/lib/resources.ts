import { setupImages } from "./resources/images.svelte.ts";
import { default as LoadingScreen, type Resource } from "./resources/Loader.svelte";

export const setupResources = (): Resource => ({
    image: setupImages(),
})

export { type Resource, LoadingScreen };