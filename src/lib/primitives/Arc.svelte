<script lang="ts">

    import { useDrawable } from "../core/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
        startAngle: number;
        endAngle: number;
    }

    let {
        fill,
        stroke,
        strokeWidth,
        startAngle,
        endAngle
    }: Props = $props();

    let sd = $derived((startAngle - 90) * Math.PI / 180);
    let ed = $derived((endAngle - 90) * Math.PI / 180);

    const register = useDrawable<{x: number, y: number, w: number, h: number}, null>();
    onMount(() => {
        return register(({ ctx }, { x, y, w, h }) => {
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
        });
    })
</script>