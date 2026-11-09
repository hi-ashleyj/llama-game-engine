<script lang="ts">

    import { useDrawable } from "../core/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
    }

    let { fill, stroke, strokeWidth }: Props = $props();
    const TWO_PI = Math.PI * 2;

    const register = useDrawable<{x: number, y: number, w: number, h: number}, null>();
    onMount(() => {
        return register(({ ctx }, { x, y, w, h }) => {
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
        })
    });
</script>