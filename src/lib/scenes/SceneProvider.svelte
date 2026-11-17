<script lang="ts">

    import type { SceneInformation, SceneLayerExports, SceneTransitionList } from "./scenes.svelte.js";
    import { onMount } from "svelte";

    interface Props {
        initial: string,
        definitions: SceneInformation,
        scenes: SceneLayerExports[],
        transitions: SceneTransitionList,
        children?: import("svelte").Snippet<[ import("svelte").Snippet<[ Llama.LayerKey ]> ]>,
    }

    let { children }: Props = $props();

</script>

{#snippet layer(key: Llama.LayerKey)}


{/snippet}

{@render children?.(layer)}