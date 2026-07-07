<script lang="ts">

    import { useScenes } from "./scenes.svelte.js";
    import { type Component, onMount } from "svelte";
    import { getTriggerLayerRender } from "../core-contexts.js";

    const triggerRender = getTriggerLayerRender();
    const scenedata = useScenes();

    let last = $state("default");

    $effect(() => {
        if (scenedata.activeScene !== last && scenedata.animationState > 0.5) {
            triggerRender();
            last = $state.snapshot(scenedata.activeScene);
        }
    })

    onMount(() => {
        last = scenedata.activeScene;
    });

    interface Props {
        scenes?: Record<string, Component>;
    }

    let { scenes = {} }: Props = $props();

</script>

{#if last && scenes[last]}
    {@const Scene = scenes[last]}
    <Scene />
{/if}