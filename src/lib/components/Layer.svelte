<script lang="ts">

    import { setupLayer } from "../setup";

    export let zIndex = 0;

    let canvas: HTMLCanvasElement | undefined;
    $: ctx = (canvas instanceof HTMLCanvasElement) ? canvas.getContext("2d") : null;

    let targets = new Set<Function>();

    let assign = function(callable: Function) {
        targets.add(callable);

        return () => { targets.delete(callable) }
    };

    let draw = function() {
        for (let callable of targets) {
            callable({ width: $width, height: $height, ctx })
        }
    };

    let { width, height } = setupLayer({
        assign, draw
    }).game;
    

</script>

<canvas width={$width} height={$height} bind:this={canvas} style:z-index={zIndex}></canvas>

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