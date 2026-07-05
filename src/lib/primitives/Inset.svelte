<script lang="ts">

    import { setupDrawable, type DrawFunction } from "../drawable.js";
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

    const targets = new Set<{ draw: DrawFunction<{x: number, y: number, w: number, h: number}> }>();

    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function ( { width, height, ctx }, o ) {
        targets.forEach(f => f.draw({ width, height, ctx }, { 
            x: o.x + left, 
            y: o.y + top, 
            w: o.w - (left + right), 
            h: o.h - (top + bottom),
        }));
    };

    let register = setupDrawable<{x: number, y: number, w: number, h: number}, {x: number, y: number, w: number, h: number}>({
        assign: (ctx) => {
            targets.add(ctx);
            return () => {
                targets.delete(ctx);
            };
        },
    });

    onMount(() => {
        return register({ draw });
    });

</script>

{@render children?.()}