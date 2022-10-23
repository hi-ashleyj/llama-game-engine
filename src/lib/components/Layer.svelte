<script lang="ts">

    import { setupLayer } from "../setup";
    import type { DrawableFunction } from "../types/contexts";

    export let zIndex = 0;

    let canvas: HTMLCanvasElement | undefined;
    $: ctx = (typeof canvas !== "undefined") ? canvas.getContext("2d") : null;

    let targets = new Set<DrawableFunction>();

    let { width, height } = setupLayer({
        assign: (callable: DrawableFunction) => {
            targets.add(callable);

            return () => { targets.delete(callable) }
        },
        draw: () => {
            if (ctx === null) return;
            ctx.clearRect(0, 0, $width, $height);
            targets.forEach(f => f({ width: $width, height: $height, ctx }));
        }
    }).game;
    

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