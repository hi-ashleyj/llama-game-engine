<script lang="ts">

    import { setupDrawable } from "$lib/setup.js";
    import type { DrawableFunction } from "$lib/types/contexts";
    import { onMount } from "svelte";

    export let fill: string | null = null;
    export let stroke: string | null = null;
    export let strokeWidth: number | null = null;

    const TWO_PI = Math.PI * 2;
    
    const draw: DrawableFunction = function({ ctx }, { x, y, w, h }: { x: number, y: number, w: number, h: number }) {
        let r = (w + h) / 4
        
        ctx.beginPath();
        ctx.arc(x + r, y + r, r, 0, TWO_PI);
        
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

    let register = setupDrawable({});

    onMount(() => {
        return register({ draw });
    })
</script>