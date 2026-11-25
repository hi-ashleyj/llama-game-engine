<script lang="ts">

    import { useProps } from "../core/layer-context.svelte.js";
    import { useDrawable, type DrawFunction } from "../core/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        points: [ number, number ][] | number[],
        close?: boolean,
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
    }

    let props: Props = $props();
    let pointers = $derived(props.points.flat());

    useProps(() => props);

    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function({ ctx }, { x, y }) {
        ctx.beginPath();
        for (let i = 0; i + 1 < props.points.length; i += 2) {
            if (i === 0) {
                ctx.moveTo(pointers[i] + x, pointers[i + 1] + y);
                continue;
            }
            ctx.lineTo(pointers[i] + x, pointers[i + 1] + y);
        }

        if (props.close) ctx.closePath();
        
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