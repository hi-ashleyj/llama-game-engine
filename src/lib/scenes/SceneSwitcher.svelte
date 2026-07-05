<script lang="ts">

    import {jumpSignal, effectiveScene} from "./scenes.js";
    import {SvelteComponent, onMount} from "svelte";
    import {getTriggerLayerRender} from "../core-contexts.js";

    const triggerRender = getTriggerLayerRender();
    let scene: string = $state();
    const changeScene = (_signal: boolean) => {
        scene = $effectiveScene;
        triggerRender();
    };

    $effect(() => changeScene($jumpSignal));

    onMount(() => {
        scene = $effectiveScene;
    });

    interface Props {
        scenes?: Record<string, typeof SvelteComponent<any,any,any>>;
    }

    let { scenes = {} }: Props = $props();

</script>

{#if scene && scenes[scene]}
    {@const SvelteComponent_1 = scenes[scene]}
    <SvelteComponent_1 />
{/if}