<script lang="ts">

    import { useProps } from "../core/layer-context.svelte.js";
    import { useDrawable } from "../core/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
        startAngle: number;
        endAngle: number;
    }

    let props: Props = $props();

    let sd = $derived((props.startAngle - 90) * Math.PI / 180);
    let ed = $derived((props.endAngle - 90) * Math.PI / 180);

    useProps(() => props);

    const register = useDrawable<{x: number, y: number, w: number, h: number}, null>();
    onMount(() => {
        return register(({ ctx }, { x, y, w, h }) => {
            let r = (w + h) / 4
    
            ctx.beginPath();
            ctx.arc(x + r, y + r, r, sd, ed);
            ctx.lineTo(x + r, y + r);
            
            if (props.fill) {
                ctx.fillStyle = props.fill;
                ctx.fill();
            }

            if (props.stroke && props.strokeWidth) {
                ctx.strokeStyle = props.stroke;
                ctx.lineWidth = props.strokeWidth;
                ctx.stroke();
            }
        });
    })
</script>