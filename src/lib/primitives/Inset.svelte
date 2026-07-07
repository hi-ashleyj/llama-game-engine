<script lang="ts">

    import { setupDrawable } from "../drawable.js";
    import { onMount } from "svelte";

    interface Props {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
        children?: import('svelte').Snippet;
    }

    let {
        left = 0,
        right = 0,
        top = 0,
        bottom = 0,
        children
    }: Props = $props();

    let register = setupDrawable<{x: number, y: number, w: number, h: number}, {x: number, y: number, w: number, h: number}>({ hasChildren: true });

    onMount(() => {
        return register({
            draw: ({ width, height, children, ctx }, o) => {
                children.forEach(f => f.draw({ width, height, ctx, children: []}, {
                    x: o.x + left, 
                    y: o.y + top, 
                    w: o.w - (left + right), 
                    h: o.h - (top + bottom),
                }))
            }    
        });
    });

</script>

{@render children?.()}