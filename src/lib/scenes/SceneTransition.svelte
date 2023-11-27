<script lang="ts">

    import {jumpSignal, sceneAnimating} from "./scenes.js";
    import {getGame, getTriggerLayerRender } from "../core-contexts.js";
    import { onDestroy } from "svelte";

    const context = getGame();
    export let duration = 1000;
    let burst = context.createBurst({duration: duration});
    let triggerRender = getTriggerLayerRender();
    onDestroy(burst.stop);

    let halfAnimationTriggered = false;

    const startAnimation = () => {
        burst.trigger();
        halfAnimationTriggered = false;
    };

    const halfAnimation = () => {
        halfAnimationTriggered = true;
        $jumpSignal = !$jumpSignal;
    };

    const completeAnimation = () => {
        $sceneAnimating = false;
    };

    $: {
        if ($sceneAnimating) startAnimation();
    }

    $: {
        if ($burst > 0.5 && !halfAnimationTriggered) halfAnimation();
        if ($burst == 1) completeAnimation();
    }

    $: normalized = 1 - (Math.abs($burst - 0.5) * 2) 

    $: { triggerRender($burst) }

</script>

{#if $burst > 0 && $burst < 1}
    <slot progress={$burst} normalized={normalized} />
{/if}