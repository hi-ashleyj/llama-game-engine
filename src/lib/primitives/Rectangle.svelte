<script lang="ts">

    import { useDrawable, type DrawFunction } from "../core/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        fill?: string | null;
        stroke?: string | null;
        strokeWidth?: number | null;
    }

    let { fill = null, stroke = null, strokeWidth = null }: Props = $props();
    
    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function({ ctx }, { x, y, w, h }) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        
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
    
    const register = useDrawable<{x: number, y: number, w: number, h: number}, null>();
    onMount(() => {
        return register(draw);
    })

</script>