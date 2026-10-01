<script lang="ts">

    import { useScenes } from "./scenes.svelte.js";

    const scenedata = useScenes();

    let { children }: { children?: import('svelte').Snippet<[{ normalized: number }]> } = $props();
    
    let normalized = $derived(1 - (Math.abs(scenedata.animationState - 0.5) * 2))

</script>

{#if scenedata.animationState > 0 && scenedata.animationState < 1}
    {@render children?.({ normalized })}
{/if}