<script lang="ts">

    import { setupDrawable } from "$lib/setup";
    import type { DrawableFunction } from "$lib/types/contexts";
    import { onMount } from "svelte";

    export let fill: string | null = null;
    export let stroke: string | null = null;
    
    const draw: DrawableFunction = function({ ctx }, { x, y, w, h }: { x: number, y: number, w: number, h: number }) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        
        if (fill) {
            ctx.fillStyle = fill;
            ctx.fill();
        }

        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.stroke();
        }
    };
    
    let register = setupDrawable({});

    onMount(() => {
        return register(draw);
    })

</script>