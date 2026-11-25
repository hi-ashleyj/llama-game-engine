<script lang="ts">

    import { getGame } from "../core/game.js";
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
    let to = $derived(context.to ? resolveTransition(definitions[context.to].in, last) : null);
    let active = $derived(context.to === context.from ? to : from);

    let countdown = $state(0);
    let length = $derived(active?.duration ?? 0);
    let percentage = $derived(length ? countdown / length : 0);
    let loading = $state(false);

    onMount(() => {
        context.changeScene(initial);
        last = initial;

        const unsub = game.on("before", ({ delta }) => {
            if (loading) {
                // test if loading is completed.
                if (true) {
                    last = context.from;
                    loading = false;
                    countdown = to?.duration ?? 0;
                    context.touch(context.to!);
                }
            } else if (context.from !== context.to) {
                // add to countdown
                countdown += delta;
                if (countdown < (from?.duration ?? 0)) return;
                // transition over, handoff to loader.
                countdown = from?.duration ?? 0;
                loading = true;
            } else if (context.to === context.from && context.from !== last) {
                // remove from countdown
                countdown -= delta;
                if (countdown > 0) return;
                countdown = 0;
                last = context.from;
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
            <Item transitioning={countdown > 0} />
        {/if}
    </Layer>
{/snippet}

{#snippet transition(z: number)}
    <Layer name={"#transition"} z={z}>
        {#if countdown > 0 && active?.transition && transitions[active.transition]}
            {let Item = $derived(transitions[active.transition])}
            <Item t={percentage} />
        {/if}
    </Layer>
{/snippet}

{@render children?.(layer, transition)}