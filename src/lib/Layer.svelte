<script lang="ts">

    import { setupLayer, getGame } from "./core-contexts.js";
    import type { DrawFunction } from "./drawable.js";
    import { onMount } from "svelte";

    let shouldRenderNextFrame = true;

    let canvas: HTMLCanvasElement | undefined = $state();
    let ctx = $derived((typeof canvas !== "undefined") ? canvas.getContext("2d") : null);

    let targets = new Set<{ draw: DrawFunction<null, null> }>();
    
    const { width, height } = getGame();

    const draw = () => {
        if (ctx === null) return;
        ctx.clearRect(0, 0, $width, $height);
        ctx.imageSmoothingEnabled = scaleMode === "smooth";
        targets.forEach(f => f.draw({ width: $width, height: $height, ctx: ctx!, children: [] }, null));
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

    interface Props {
        zIndex?: number;
        staticMode?: boolean;
        scaleMode?: "pixelated" | "smooth";
        name: string;
        children?: import('svelte').Snippet;
    }

    let {
        zIndex = 0,
        staticMode = false,
        scaleMode = "pixelated",
        name,
        children
    }: Props = $props();

    onMount(() => {
        return register({ 
            draw, 
            isStatic: () => { 
                if (shouldRenderNextFrame) { shouldRenderNextFrame = false; draw(); } 
                return staticMode; 
            },
            name: name,
        });
    })

</script>

<canvas width={$width} height={$height} bind:this={canvas} style:z-index={zIndex}></canvas>
{@render children?.()}

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
