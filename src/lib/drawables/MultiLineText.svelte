<script lang="ts">

    import { setupDrawable, type DrawFunction } from "$lib/drawable.js";
    import { onMount } from "svelte";
    import { getGame } from "$lib/core-contexts.js";

    export let text: string;
    export let size: number;
    export let spacing: number = 1.4;
    export let font: string | null = null;
    export let style: string | undefined = undefined;
    export let fill: string | undefined = undefined;
    export let stroke: string | undefined = undefined;
    export let strokeWidth: number | null = null;
    export let alignH: "left" | "center" | "right" = "left";
    export let alignV: "top" | "middle" | "bottom" | "alphabetic" = "top";

    const { defaultTextFontFace } = getGame();

    $: effectiveFont = font ? font : typeof $defaultTextFontFace === "string" ? $defaultTextFontFace : "sans-serif";
    $: computedFont = (style ? style + " " : "") + size + "px " + effectiveFont;
    $: splits = text?.split("\n") || [];

    $: offset =
        alignV === "bottom"
            ? ((splits?.length || 1) - 1) * size * spacing
            : alignV === "middle"
            ? ((splits?.length || 1) - 1) * size * spacing * 0.5
            : 0;

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

    let register = setupDrawable<{x: number, y: number, w: number, h: number}, null>({});

    onMount(() => {
        return register({ draw });
    });
</script>
