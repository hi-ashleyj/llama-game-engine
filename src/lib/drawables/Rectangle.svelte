<script lang="ts">

    import { setupDrawable, type DrawFunction } from "$lib/drawable.js";
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
    
    let register = setupDrawable<{x: number, y: number, w: number, h: number}, null>({ hasChildren: false });

    onMount(() => {
        return register({ draw });
    })

</script>