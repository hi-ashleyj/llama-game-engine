<script lang="ts">

    import { setupDrawable } from "$lib/setup";
    import type { DrawableFunction } from "$lib/types/contexts";
    import { onMount } from "svelte";

    export let fill: string | null = null;
    export let stroke: string | null = null;
    export let startAngle: number;
    export let endAngle: number;

    $: sd = (startAngle - 90) * Math.PI / 180;
    $: ed = (endAngle - 90) * Math.PI / 180;
    
    const draw: DrawableFunction = function({ ctx }, { x, y, w, h }: { x: number, y: number, w: number, h: number }) {
        let r = (w + h) / 4
        
        ctx.beginPath();
        ctx.arc(x + r, y + r, r, sd, ed);
        ctx.lineTo(x + r, y + r);
        
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
        return register({ draw });
    })
</script>