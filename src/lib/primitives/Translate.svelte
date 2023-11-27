<script lang="ts">

    import { setupDrawable, type DrawFunction } from "../drawable.js";
    import { onMount } from "svelte";

    export let x: number;
    export let y: number;

    const targets = new Set<{ draw: DrawFunction<{x: number, y: number}> }>();

    const draw: DrawFunction<{x: number, y: number}> = function ( { width, height, ctx }, offset ) {
        targets.forEach(f => f.draw({ width, height, ctx }, { x: offset.x + x, y: offset.y + y }));
    };

    let register = setupDrawable<{x: number, y: number}, {x: number, y: number}>({
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