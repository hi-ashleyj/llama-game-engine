<script lang="ts">

    import { useProps } from "../core/layer.svelte.js";
    import { useDrawable, type DrawFunction } from "../core/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
        radius?: number | [ number ] | [ number, number ] | [ number, number, number, number ];
    }

    let props: Props = $props();
    useProps(() => props);
    
    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function({ ctx }, { x, y, w, h }: { x: number, y: number, w: number, h: number }) {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, props.radius ?? 0);
        
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