<script lang="ts">

    import { setupDrawable, type DrawFunction } from "$lib/drawable.js";
    import { onMount } from "svelte";

    export let fill: string | null = null;
    export let stroke: string | null = null;
    export let strokeWidth: number | null = null;
    export let radius: number | [ number ] | [ number, number ] | [ number, number, number ] | [ number, number, number, number ] = 0;
    
    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function({ ctx }, { x, y, w, h }: { x: number, y: number, w: number, h: number }) {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, radius);
        
        if (fill) {
            ctx.fillStyle = fill;
            ctx.fill();
        }

        if (stroke && strokeWidth) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = strokeWidth;
            ctx.stroke();
        }
    };
    
    let register = setupDrawable<{x: number, y: number, w: number, h: number}, null>({});

    onMount(() => {
        return register({ draw });
    })

</script>