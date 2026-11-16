<script lang="ts">

    import type { DrawFunction } from "./drawable.js";

    import { onMount } from "svelte";
    import { getGame } from "./game.js";
    import { setupCanvas } from "./layer.svelte.js";

    interface Props {
        mode?: "always" | "calculated" | "manual";
        scaling?: "pixelated" | "smooth";
        children?: import('svelte').Snippet;
    }

    let { mode = "always", scaling = "pixelated", children }: Props = $props();

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
        changed: () => {
            if (mode === "calculated") invalidated = true;
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
            console.log("Frame!");
            ctx.clearRect(0, 0, width, height);
            ctx.imageSmoothingEnabled = scaling === "smooth";
            ctx.globalAlpha = 1;

            ls.forEach(it => it({ width, height, ctx }, null));

            if (mode !== "always") invalidated = false;
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
