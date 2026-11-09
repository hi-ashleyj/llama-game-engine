<script lang="ts">
    import { useDrawable } from "../core/drawable.js";
    import { onMount } from "svelte";
    
    interface Props {
        /**
     * FALSE = ANCHOR TOP LEFT
     * TRUE = ANCHOR CENTER
     */
        centered?: boolean;
        degrees: number;
        children?: import('svelte').Snippet;
    }
    let { centered = false, degrees, children }: Props = $props();

    const register = useDrawable<{ x: number, y: number, w: number, h: number }, { x: number, y: number, w: number, h: number }>(true);
    onMount(() => {
        return register(({ ctx, children }, { x, y, w, h }) => {
            ctx.translate(x, y);
            ctx.rotate(degrees * Math.PI / 180 )
            children({ x: (centered) ? w * -0.5 : 0, y: (centered) ? h * -0.5 : 0, w, h });
            ctx.resetTransform();
        });
    });
</script>

{@render children?.()}