<script lang="ts">

    import {jumpSignal, sceneAnimating} from "./scenes.js";
    import {getGame, getTriggerLayerRender } from "../core-contexts.js";
    import { onDestroy } from "svelte";

    const context = getGame();
    interface Props {
        duration?: number;
        children?: import('svelte').Snippet<[any]>;
    }

    let { duration = 1000, children }: Props = $props();
    let burst = context.createBurst({duration: duration});
    let triggerRender = getTriggerLayerRender();
    onDestroy(burst.stop);

    let halfAnimationTriggered = $state(false);

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

    $effect(() => {
        if ($sceneAnimating) startAnimation();
    })
    $effect(() => {
        if ($burst > 0.5 && !halfAnimationTriggered) halfAnimation();
        if ($burst == 1) completeAnimation();
    })

    let normalized = $derived(1 - (Math.abs($burst - 0.5) * 2))
    $effect(() => {
        triggerRender($burst)
    })

</script>

{#if $burst > 0 && $burst < 1}
    {@render children?.({ progress: $burst, normalized, })}
{/if}