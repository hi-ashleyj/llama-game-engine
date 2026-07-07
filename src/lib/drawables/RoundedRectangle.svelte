<script lang="ts">

    import { setupDrawable, type DrawFunction } from "$lib/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        fill?: string | null;
        stroke?: string | null;
        strokeWidth?: number | null;
        radius?: number | [ number ] | [ number, number ] | [ number, number, number ] | [ number, number, number, number ];
    }

    let {
        fill = null,
        stroke = null,
        strokeWidth = null,
        radius = 0
    }: Props = $props();
    
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
    
    let register = setupDrawable<{x: number, y: number, w: number, h: number}, null>({ hasChildren: false });

    onMount(() => {
        return register({ draw });
    })

</script>