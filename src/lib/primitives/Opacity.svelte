<script lang="ts">

    import { setupDrawable, type DrawFunction } from "../drawable.js";
    import { onMount } from "svelte";

    export let opacity: number;

    const targets = new Set<{ draw: DrawFunction<unknown> }>();

    const draw: DrawFunction<unknown> = function ( { width, height, ctx }, offset ) {
        if (opacity <= 0) return;
        ctx.globalAlpha = Math.min(opacity, 1);
        targets.forEach(f => f.draw({ width, height, ctx }, offset));
        ctx.globalAlpha = 1;
    };

    let register = setupDrawable<unknown, unknown>({
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