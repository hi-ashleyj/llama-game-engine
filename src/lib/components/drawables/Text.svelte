<script lang="ts">

    import { setupDrawable } from "$lib/setup";
    import type { DrawableFunction } from "$lib/types/contexts";
    import { onMount } from "svelte";

    export let text: string;
    export let size: number;
    export let font: string;
    export let style: string | undefined = undefined;
    export let fill: string | undefined = undefined;
    export let stroke: string | undefined = undefined;
    export let alignH: "left" | "center" | "right" = "left";
    export let alignV: "top" | "middle" | "bottom" | "alphabetic" = "top";

    $: computedFont = ((style) ? style + " ": "") + size + "px " + font;
    
    const draw: DrawableFunction = function({ ctx }, { x, y, w, h }: { x: number, y: number, w: number, h: number }) {
        if (!text) return;
        
        ctx.beginPath();
        ctx.textAlign = alignH;
        ctx.textBaseline = alignV;
        ctx.font = computedFont;

        let actualX = x + (alignH === "right" ? w : alignH === "center" ? w / 2 : 0);
        let actualY = y + (alignV === "bottom" ? h : alignV === "middle" ? (h / 2) + (size * 0.10) : 0);

        if (fill) {
            ctx.fillStyle = fill;
            ctx.fillText(text, actualX, actualY);
        }
        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.strokeText(text, actualX, actualY);
        }
    };

    let register = setupDrawable({});

    onMount(() => {
        return register({ draw });
    })
    
</script>