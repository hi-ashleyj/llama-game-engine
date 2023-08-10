<script lang="ts">

    import { setupLayer, getGame } from "./core-contexts.js";
    import type { DrawFunction } from "./drawable.js";
    import { onMount } from "svelte";

    export let zIndex = 0;
    export let staticMode: boolean = false;
    let shouldRenderNextFrame = true;

    let canvas: HTMLCanvasElement | undefined;
    $: ctx = (typeof canvas !== "undefined") ? canvas.getContext("2d") : null;

    let targets = new Set<{ draw: DrawFunction<null> }>();
    
    const { width, height } = getGame();

    const draw = () => {
        if (ctx === null) return;
        ctx.clearRect(0, 0, $width, $height);
        targets.forEach(f => f.draw({ width: $width, height: $height, ctx: ctx! }));
    }

    let register = setupLayer({
        assign: (ctx) => {
            targets.add(ctx);
            return () => { targets.delete(ctx) }
        },
        requestFrame: () => {
            if (!staticMode) return;
            shouldRenderNextFrame = true;
        }
    });

    export let name: string;

    onMount(() => {
        return register({ 
            draw, 
            isStatic: () => { 
                if (shouldRenderNextFrame) { shouldRenderNextFrame = false; draw(); } 
                return staticMode; 
            },
            name: "",
        });
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
