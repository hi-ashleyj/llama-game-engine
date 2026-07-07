<script lang="ts">
    import { setupDrawable } from "../drawable.js";
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

    let register = setupDrawable<{ x: number, y: number, w: number, h: number }, { x: number, y: number, w: number, h: number }>({ hasChildren: true });
    onMount(() => {
        return register({
            draw: ({ width, height, ctx, children }, { x, y, w, h }) => {
                ctx.translate(x, y);
                ctx.rotate(degrees * Math.PI / 180 )
                children.forEach(f => f.draw({ width, height, ctx, children: [] }, { x: (centered) ? w * -0.5 : 0, y: (centered) ? h * -0.5 : 0, w, h }));
                ctx.resetTransform();
            }
        });
    });
</script>

{@render children?.()}