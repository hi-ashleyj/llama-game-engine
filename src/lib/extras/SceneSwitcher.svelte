<script lang="ts">

    import {jumpSignal, effectiveScene} from "./scenes.js";
    import {SvelteComponent, onMount} from "svelte";
    import {getTriggerLayerRender} from "@hi-ashleyj/llama";

    const triggerRender = getTriggerLayerRender();
    let scene: string;
    const changeScene = (_signal: boolean) => {
        scene = $effectiveScene;
        triggerRender();
    };

    $: changeScene($jumpSignal);

    onMount(() => {
        scene = $effectiveScene;
    });

    export let scenes: Record<string, typeof SvelteComponent> = {};

</script>

{#if scene && scenes[scene]}
    <svelte:component this={scenes[scene]}></svelte:component>
{/if}