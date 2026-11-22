<script lang="ts">

    import Layer from "../core/Layer.svelte";
    import { type SceneInformation, type SceneLayerExports, type SceneTransitionList, useScenes } from "./scenes.svelte.js";
    import { onMount } from "svelte";

    const raise = (str: string) => { throw new Error(str) };
    const context = useScenes();

    interface Props {
        initial: Llama.Scene,
        definitions: SceneInformation,
        scenes: SceneLayerExports[],
        transitions: SceneTransitionList,
        children?: import("svelte").Snippet<[ import("svelte").Snippet<[ Llama.LayerKey, number ]> ]>,
    }

    let { children, initial, scenes, transitions, definitions }: Props = $props();

    let block = $derived(scenes.filter(it => it.SCENE === context.from));

    onMount(() => {
        context.changeScene(initial);
    })

</script>

{#snippet layer(key: Llama.LayerKey, z: number)}
    {let active = $derived(block.filter((it) => it.LAYER === key))}
    {let Item = $derived((active.length > 1) ? raise(`Ambigous Layer/Scene combo on ${key}`) : (active.length > 0) ? active[0].default : null)}
    <Layer name={key} z={z}>
        {#if Item}
            <Item transitioning={false} />
        {/if}
    </Layer>
{/snippet}

{@render children?.(layer)}