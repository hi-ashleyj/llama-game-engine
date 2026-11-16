<script lang="ts">

    import { useProps } from "../core/layer.svelte.js";
    import { useDrawable, type DrawFunction } from "../core/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
    }

    let props: Props = $props();

    useProps(() => props);
    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function({ ctx }, { x, y, w, h }) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        
        if (props.fill) {
            ctx.fillStyle = props.fill;
            ctx.fill();
        }

        if (props.stroke && props.strokeWidth) {
            ctx.strokeStyle = props.stroke;
            ctx.lineWidth = props.strokeWidth;
            ctx.stroke();
        }
    };
    
    const register = useDrawable<{x: number, y: number, w: number, h: number}, null>();
    onMount(() => {
        return register(draw);
    })

</script>