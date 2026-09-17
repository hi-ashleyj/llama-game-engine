<script lang="ts">

    import { useScenes } from "./scenes.svelte.js";
    import { getTriggerLayerRender } from "../core-contexts.js";

    const scenedata = useScenes();

    let { children }: { children?: import('svelte').Snippet<[{ normalized: number }]> } = $props();
    
    let normalized = $derived(1 - (Math.abs(scenedata.animationState - 0.5) * 2))
    let triggerRender = getTriggerLayerRender();

    $effect(() => {
        triggerRender(normalized)
    })

</script>

{#if scenedata.animationState > 0 && scenedata.animationState < 1}
    {@render children?.({ normalized })}
{/if}