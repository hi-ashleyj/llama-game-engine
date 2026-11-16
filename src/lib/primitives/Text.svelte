<script lang="ts">

    import { useProps } from "../core/layer.svelte.js";
    import { useDrawable, type DrawFunction } from "../core/drawable.js";
    import { getGame } from "../core/game.js";
    import { onMount } from "svelte";

    interface Props {
        text: string;
        size: number;
        font?: string | null;
        style?: string;
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
        alignH?: "left" | "center" | "right";
        alignV?: "top" | "middle" | "bottom" | "alphabetic";
    }

    let props: Props = $props();
    useProps(() => props);
    
    const { font: defaultFont } = getGame();

    let effectiveFont = $derived(props.font ? props.font : typeof defaultFont() === "string" ? defaultFont() : "sans-serif");
    let computedFont = $derived(((props.style) ? props.style + " ": "") + props.size + "px " + effectiveFont);
    
    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function({ ctx }, { x, y, w, h }: { x: number, y: number, w: number, h: number }) {
        if (!props.text) return;
        
        ctx.beginPath();
        ctx.textAlign = props.alignH ?? "left";
        ctx.textBaseline = props.alignV ?? "top";
        ctx.font = computedFont;

        let actualX = x + (props.alignH === "right" ? w : props.alignH === "center" ? w / 2 : 0);
        let actualY = y + (props.alignV === "bottom" ? h : props.alignV === "middle" ? (h / 2) + (props.size * 0.10) : 0);

        if (props.fill) {
            ctx.fillStyle = props.fill;
            ctx.fillText(props.text, actualX, actualY);
        }
        if (props.stroke && props.strokeWidth) {
            ctx.strokeStyle = props.stroke;
            ctx.lineWidth = props.strokeWidth;
            ctx.strokeText(props.text, actualX, actualY);
        }
    };

    const register = useDrawable<{x: number, y: number, w: number, h: number}, null>();
    onMount(() => {
        return register(draw);
    })
    
</script>