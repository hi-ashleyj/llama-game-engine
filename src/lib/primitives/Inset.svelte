<script lang="ts">

    import { setupDrawable, type DrawFunction } from "../drawable.js";
    import { onMount } from "svelte";

    export let left: number = 0;
    export let right: number = 0;
    export let top: number = 0;
    export let bottom: number = 0;

    const targets = new Set<{ draw: DrawFunction<{x: number, y: number, w: number, h: number}> }>();

    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function ( { width, height, ctx }, o ) {
        targets.forEach(f => f.draw({ width, height, ctx }, { 
            x: o.x + left, 
            y: o.y + top, 
            w: o.w - (left + right), 
            h: o.h - (top + bottom),
        }));
    };

    let register = setupDrawable<{x: number, y: number, w: number, h: number}, {x: number, y: number, w: number, h: number}>({
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