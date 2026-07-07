<script lang="ts">

    import { setupDrawable, type DrawFunction } from "$lib/drawable.js";
    import { getGame } from "$lib/core-contexts.js";
    import { onMount } from "svelte";

    interface Props {
        text: string;
        size: number;
        font?: string | null;
        style?: string | undefined;
        fill?: string | undefined;
        stroke?: string | undefined;
        strokeWidth?: number | null;
        alignH?: "left" | "center" | "right";
        alignV?: "top" | "middle" | "bottom" | "alphabetic";
    }

    let {
        text,
        size,
        font = null,
        style = undefined,
        fill = undefined,
        stroke = undefined,
        strokeWidth = null,
        alignH = "left",
        alignV = "top"
    }: Props = $props();

    const { defaultTextFontFace } = getGame();

    let effectiveFont = $derived(font ? font : typeof $defaultTextFontFace === "string" ? $defaultTextFontFace : "sans-serif");
    let computedFont = $derived(((style) ? style + " ": "") + size + "px " + effectiveFont);
    
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

    let register = setupDrawable<{x: number, y: number, w: number, h: number}, null>({ hasChildren: false });

    onMount(() => {
        return register({ draw });
    })
    
</script>