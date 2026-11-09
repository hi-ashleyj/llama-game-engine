<script lang="ts">

    import { useDrawable, type DrawFunction } from "../core/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        points: [ number, number ][] | number[],
        close?: boolean,
        fill?: string | null;
        stroke?: string | null;
        strokeWidth?: number | null;
    }

    let { fill = null, stroke = null, strokeWidth = null, points, close }: Props = $props();
    let pointers = $derived(points.flat());

    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function({ ctx }, { x, y }) {
        ctx.beginPath();
        for (let i = 0; i + 1 < points.length; i += 2) {
            if (i === 0) {
                ctx.moveTo(pointers[i] + x, pointers[i + 1] + y);
                continue;
            }
            ctx.lineTo(pointers[i] + x, pointers[i + 1] + y);
        }

        if (close) ctx.closePath();
        
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