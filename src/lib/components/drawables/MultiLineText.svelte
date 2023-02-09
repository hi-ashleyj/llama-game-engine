<script lang="ts">
    import { setupDrawable } from "$lib/setup";
    import type { DrawableFunction } from "$lib/types/contexts";
    import { onMount } from "svelte";

    export let text: string;
    export let size: number;
    export let spacing: number = 1.4;
    export let font: string;
    export let style: string | undefined = undefined;
    export let fill: string | undefined = undefined;
    export let stroke: string | undefined = undefined;
    export let strokeWidth: number | null = null;
    export let alignH: "left" | "center" | "right" = "left";
    export let alignV: "top" | "middle" | "bottom" | "alphabetic" = "top";

    $: computedFont = (style ? style + " " : "") + size + "px " + font;
    $: splits = text?.split("\n") || [];

    $: offset =
        alignV === "bottom"
            ? ((splits?.length || 1) - 1) * size * spacing
            : alignV === "middle"
            ? ((splits?.length || 1) - 1) * size * spacing * 0.5
            : 0;

    const draw: DrawableFunction = function (
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

    let register = setupDrawable({});

    onMount(() => {
        return register({ draw });
    });
</script>
