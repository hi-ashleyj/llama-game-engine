<script lang="ts">

    import { setupDrawable, type DrawFunction } from "$lib/drawable.js";
    import { getGame } from "$lib/core-contexts.js";
    import { onMount } from "svelte";

    export let text: string;
    export let size: number;
    export let font: string | null = null;
    export let style: string | undefined = undefined;
    export let fill: string | undefined = undefined;
    export let stroke: string | undefined = undefined;
    export let strokeWidth: number | null = null;
    export let alignH: "left" | "center" | "right" = "left";
    export let alignV: "top" | "middle" | "bottom" | "alphabetic" = "top";

    const { defaultTextFontFace } = getGame();

    $: effectiveFont = font ? font : typeof $defaultTextFontFace === "string" ? $defaultTextFontFace : "sans-serif";
    $: computedFont = ((style) ? style + " ": "") + size + "px " + effectiveFont;
    
    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function({ ctx }, { x, y, w, h }: { x: number, y: number, w: number, h: number }) {
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
        if (stroke && strokeWidth) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = strokeWidth;
            ctx.strokeText(text, actualX, actualY);
        }
    };

    let register = setupDrawable<{x: number, y: number, w: number, h: number}, null>({});

    onMount(() => {
        return register({ draw });
    })
    
</script>