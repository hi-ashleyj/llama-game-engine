<script lang="ts">

    import { useDrawable, type DrawFunction } from "$lib/core/drawable.js";
    import { onMount } from "svelte";
    import { getGame } from "$lib/core/game.js";

    interface Props {
        text: string;
        size: number;
        spacing?: number;
        font?: string;
        style?: string;
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
        alignH?: "left" | "center" | "right";
        alignV?: "top" | "middle" | "bottom" | "alphabetic";
    }

    let {
        text,
        size,
        spacing = 1.4,
        font = undefined,
        style = undefined,
        fill = undefined,
        stroke = undefined,
        strokeWidth = undefined,
        alignH = "left",
        alignV = "top"
    }: Props = $props();

    const { font: defaultFont } = getGame();

    let effectiveFont = $derived(font ? font : typeof defaultFont() === "string" ? defaultFont() : "sans-serif");
    let computedFont = $derived((style ? style + " " : "") + size + "px " + effectiveFont);
    let splits = $derived(text?.split("\n") || []);

    let offset =
        $derived(alignV === "bottom"
            ? ((splits?.length || 1) - 1) * size * spacing
            : alignV === "middle"
            ? ((splits?.length || 1) - 1) * size * spacing * 0.5
            : 0);

    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function (
        { ctx },
        { x, y }: { x: number; y: number; w: number; h: number }
    ) {
        if (!splits) return;

        for (let i = 0; i < splits.length; i++) {
            const line = splits[i];

            ctx.beginPath();
            ctx.textAlign = alignH;
            ctx.textBaseline = alignV;
            ctx.font = computedFont;

            if (fill) {
                ctx.fillStyle = fill;
                ctx.fillText(line, x, y + size * spacing * i - offset);
            }
            if (stroke && strokeWidth) {
                ctx.strokeStyle = stroke;
                ctx.lineWidth = strokeWidth;
                ctx.strokeText(line, x, y + size * spacing * i - offset);
            }
        }
    };

    let register = useDrawable<{x: number, y: number, w: number, h: number}, null>();

    onMount(() => {
        return register(draw);
    });
</script>
