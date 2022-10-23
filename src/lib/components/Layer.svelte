<script lang="ts">

    import { setupLayer, getGame } from "../setup";
    import type { DrawableFunction } from "../types";
    import { onMount } from "svelte";

    export let zIndex = 0;

    let canvas: HTMLCanvasElement | undefined;
    $: ctx = (typeof canvas !== "undefined") ? canvas.getContext("2d") : null;

    let targets = new Set<{ draw: DrawableFunction }>();

    const draw = () => {
        if (ctx === null) return;
        ctx.clearRect(0, 0, $width, $height);
        targets.forEach(f => f.draw({ width: $width, height: $height, ctx }));
    }

    let { width, height } = getGame();

    let register = setupLayer({
        assign: (ctx) => {
            targets.add(ctx);

            return () => { targets.delete(ctx) }
        }
    });

    onMount(() => {
        return register({ draw });
    })

</script>

<canvas width={$width} height={$height} bind:this={canvas} style:z-index={zIndex}></canvas>
<slot />

<style>
    canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
</style>