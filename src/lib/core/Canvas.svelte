<script lang="ts">

    import type { DrawFunction } from "./drawable.js";

    import { onMount } from "svelte";
    import { getGame } from "./game.js";
    import { setupCanvas } from "./layer.js";

    interface Props {
        allFrames?: boolean;
        scaling?: "pixelated" | "smooth";
        children?: import('svelte').Snippet;
    }

    let { allFrames = true, scaling = "pixelated", children }: Props = $props();

    const { size, on } = getGame();
    let [ width, height ] = $derived(size());

    let canvas: HTMLCanvasElement | undefined = $state();
    let ctx = $derived((typeof canvas !== "undefined") ? canvas.getContext("2d") : null);
    let invalidated = $state(true);

    const layers = new Map<symbol, { draw: DrawFunction<null>, name: string, z: number }>();
    let ls: DrawFunction<null>[] = [];
    const rebuild = () => {
        ls = [ ...layers.values() ].toSorted((a, b) => a.z - b.z).map(it => it.draw);
    }
    const push = (draw: DrawFunction<null>) => {
        const id = Symbol();
        const item = { draw, name: "", z: 0 };
        layers.set(id, item);
        rebuild();
        return id;
    }
    const change = (id: symbol, { name, z }: { name?: string, z?: number }) => {
        const layer = layers.get(id);
        if (!layer) return;
        if (name) layer.name = name;
        if (z) layer.z = z;
        layers.set(id, layer);
        rebuild();
    }
    const destroy = (id: symbol) => {
        layers.delete(id);
        rebuild();
    }

    setupCanvas({
        invalidate: () => {
            invalidated = true;
        },
        registerLayer: (draw: DrawFunction<null>) => {
            const id = push(draw);
            return {
                update: ({ name, z }) => {
                    change(id, { name, z });
                },
                destroy: () => {
                    destroy(id);
                }
            }
        },
        layers: () => ls,
    });

    onMount(() => {
        //@ts-expect-error
        return on("draw", () => {
            if (!invalidated) return;
            if (ctx === null) return;
            ctx.clearRect(0, 0, width, height);
            ctx.imageSmoothingEnabled = scaling === "smooth";

            ls.forEach(it => it({ width, height, ctx }, null));

            if (!allFrames) invalidated = false;
        })
    });

</script>

<canvas {width} {height} bind:this={canvas}></canvas>
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
