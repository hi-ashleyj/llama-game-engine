<script lang="ts">

    import { setupDrawable, type DrawFunction } from "$lib/drawable.js";
    import { onMount } from "svelte";

    export let fill: string | null = null;
    export let stroke: string | null = null;
    export let strokeWidth: number | null = null;
    
    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function({ ctx }, { x, y, w, h }) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        
        if (fill) {
            ctx.fillStyle = fill;
            ctx.fill();
        }

        if (stroke && strokeWidth) {
            ctx.strokeStyle = stroke;
            ctx.stroke();
        }
    };
    
    let register = setupDrawable<{x: number, y: number, w: number, h: number}, null>({});

    onMount(() => {
        return register({ draw });
    })

</script>