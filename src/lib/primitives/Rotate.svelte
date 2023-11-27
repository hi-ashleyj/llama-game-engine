<script lang="ts">
    import { setupDrawable, type DrawFunction } from "../drawable.js";
    import { onMount } from "svelte";
    /**
     * FALSE = ANCHOR TOP LEFT
     * TRUE = ANCHOR CENTER
     */
    export let centered = false;
    export let degrees: number;
    const targets = new Set<{ draw: DrawFunction<{ x: number, y: number, w: number, h: number }> }>();
    const draw: DrawFunction<{ x: number, y: number, w: number, h: number }> = function ( { width, height, ctx }, { x, y, w, h} ) {
        ctx.translate(x, y);
        ctx.rotate(degrees * Math.PI / 180 )
        targets.forEach(f => f.draw({ width, height, ctx }, { x: (centered) ? w * -0.5 : 0, y: (centered) ? h * -0.5 : 0, w, h }));
        ctx.resetTransform();
    };
    let register = setupDrawable<{ x: number, y: number, w: number, h: number }, { x: number, y: number, w: number, h: number }>({
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