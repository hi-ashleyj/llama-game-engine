<script lang="ts">

    import { setupDrawable } from "../setup";
    import type { DrawableFunction } from "../types/contexts";
    import { onMount } from "svelte";

    export let x = 0;
    export let y = 0;
    export let w = 0;
    export let h = 0;
    /**
     * FALSE = ANCHOR TOP LEFT
     * TRUE = ANCHOR CENTER
     */
    export let centered = false;

    $: ax = (centered) ? x - (w / 2) : x;
    $: ay = (centered) ? y - (h / 2) : y;

    const targets = new Set<{ draw: DrawableFunction }>();

    const draw: DrawableFunction = function ( { width, height, ctx } ) {
        targets.forEach(f => f.draw({ width, height, ctx }, { x: ax, y: ay, w, h }));
    };

    let register = setupDrawable({
        assign: (ctx) => {
            targets.add(ctx);
            return () => {
                targets.delete(ctx);
            };
        },
    });

    onMount(() => {
        return register({ draw });
    });

</script>

<slot/>