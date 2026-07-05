<script lang="ts">

    import { setupDrawable, type DrawFunction } from "../drawable.js";
    import { onMount } from "svelte";

    interface Props {
        x?: number;
        y?: number;
        w: number;
        h: number;
        /**
     * TRUE = ALIGN CENTER
     * FALSE (default) = ALIGN TOP LEFT
     */
        center?: boolean;
        children?: import('svelte').Snippet;
    }

    let {
        x = 0,
        y = 0,
        w,
        h,
        center = false,
        children
    }: Props = $props();

    const targets = new Set<{ draw: DrawFunction<{x: number, y: number, w: number, h: number}> }>();

    const draw: DrawFunction<{x: number, y: number}> = function ( { width, height, ctx }, offset ) {
        targets.forEach(f => f.draw({ width, height, ctx }, { x: offset.x + x - (center ? w / 2 : 0), y: offset.y + y - (center ? h / 2 : 0), w, h }));
    };

    let register = setupDrawable<{x: number, y: number}, {x: number, y: number, w: number, h: number}>({
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