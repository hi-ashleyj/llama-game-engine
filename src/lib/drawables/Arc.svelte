<script lang="ts">

    import { setupDrawable, type DrawFunction } from "$lib/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        fill?: string | null;
        stroke?: string | null;
        strokeWidth?: number | null;
        startAngle: number;
        endAngle: number;
    }

    let {
        fill = null,
        stroke = null,
        strokeWidth = null,
        startAngle,
        endAngle
    }: Props = $props();

    let sd = $derived((startAngle - 90) * Math.PI / 180);
    let ed = $derived((endAngle - 90) * Math.PI / 180);
    
    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function({ ctx }, { x, y, w, h }: { x: number, y: number, w: number, h: number }) {
        let r = (w + h) / 4
        
        ctx.beginPath();
        ctx.arc(x + r, y + r, r, sd, ed);
        ctx.lineTo(x + r, y + r);
        
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