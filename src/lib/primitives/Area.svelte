<script lang="ts">

    import { setupDrawable, type DrawFunction } from "../drawable.js";
    import { onMount } from "svelte";

    export let x = 0;
    export let y = 0;
    export let w: number;
    export let h: number;

    /**
     * TRUE = ALIGN CENTER
     * FALSE (default) = ALIGN TOP LEFT
     */
    export let center = false;

    const targets = new Set<{ draw: DrawFunction<{x: number, y: number, w: number, h: number}> }>();

    const draw: DrawFunction<{x: number, y: number}> = function ( { width, height, ctx }, offset ) {
        targets.forEach(f => f.draw({ width, height, ctx }, { x: offset.x + x - (center ? w / 2 : 0), y: offset.y + y - (center ? h / 2 : 0), w, h }));
    };

    let register = setupDrawable<{x: number, y: number}, {x: number, y: number, w: number, h: number}>({
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