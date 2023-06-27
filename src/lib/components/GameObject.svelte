<script lang="ts">

    import { setupDrawable } from "../setup.js";
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
    export let opacity = 1;

    $: ax = (centered) ? x - (w / 2) : x;
    $: ay = (centered) ? y - (h / 2) : y;

    const targets = new Set<{ draw: DrawableFunction }>();

    const draw: DrawableFunction = function ( { width, height, ctx } ) {
        if (opacity <= 0) return;
        if (opacity < 1) {
            ctx.globalAlpha = opacity;
        }
        targets.forEach(f => f.draw({ width, height, ctx }, { x: ax, y: ay, w, h }));
        if (opacity < 1) {
            ctx.globalAlpha = 1;
        }
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