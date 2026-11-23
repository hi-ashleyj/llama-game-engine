<script lang="ts">

    import { getGame } from "../core/game.ts";
    import Layer from "../core/Layer.svelte";
    import { type SceneInformation, type SceneLayerExports, type SceneTransitionList, useScenes, resolveTransition } from "./scenes.svelte.js";
    import { onMount, type Snippet } from "svelte";

    const raise = (str: string) => { throw new Error(str) };
    const context = useScenes();
    const game = getGame();

    interface Props {
        initial: Llama.Scene,
        definitions: SceneInformation,
        scenes: SceneLayerExports[],
        transitions: SceneTransitionList,
        children?: Snippet<[ Snippet<[ Llama.LayerKey, number ]>, Snippet<[ number ]> ]>,
    }

    let { children, initial, scenes, transitions, definitions }: Props = $props();
    let block = $derived(scenes.filter(it => it.SCENE === context.from));
    
    let last: Llama.Scene | null = $state(null);
    let from = $derived(context.from ? resolveTransition(definitions[context.from].out, context.to) : null);
    let to = $derived(context.to ? resolveTransition(definitions[context.to].out, last) : null);
    
    let countdown = $state(0);
    let loading = $state(false);

    onMount(() => {
        context.changeScene(initial);
        last = initial;

        const unsub = game.on("before", ({ delta }) => {
            if (context.from !== context.to) {
                countdown = Math.min(countdown + delta, from?.duration ?? 0);
            }
        });

        return unsub;
    });

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

{#snippet transition(z: number)}
    <Layer name={"#transition"} z={z}>
        {#if countdown > 0}

        {/if}
    </Layer>
{/snippet}

{@render children?.(layer, transition)}