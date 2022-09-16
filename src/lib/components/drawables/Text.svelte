<script lang="ts">

    import { setupDrawable } from "$lib/setup";
    import type { DrawableFunction } from "$lib/types/contexts";

    export let text: string;
    export let size: number;
    export let font: string;
    export let style: string | undefined;
    export let fill: string | undefined;
    export let stroke: string | undefined;
    export let alignH: "left" | "center" | "right" = "left";
    export let alignV: "top" | "middle" | "bottom" | "alphabetic" = "top";

    $: computedFont = ((style) ? style + " ": "") + size + "px " + font;
    
    const draw: DrawableFunction = function({ ctx }, { x, y }: { x: number, y: number, w: number, h: number }) {
        if (!text) return;
        
        ctx.beginPath();
        ctx.textAlign = alignH;
        ctx.textBaseline = alignV;
        ctx.font = computedFont;

        if (fill) {
            ctx.fillStyle = fill;
            ctx.fillText(text, x, y);
        }
        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.strokeText(text, x, y);
        }
    };
    
    setupDrawable({ draw });
    
</script>