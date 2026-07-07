<script lang="ts">

    import { setupDrawable } from "../drawable.js";
    import { onMount } from "svelte";

    interface Props {
        x: number;
        y: number;
        children?: import('svelte').Snippet;
    }

    let { x, y, children }: Props = $props();

    let register = setupDrawable<{x: number, y: number}, {x: number, y: number}>({ hasChildren: true });

    onMount(() => {
        return register({
            draw: ({ width, height, ctx, children }, offset) => {
                children.forEach(f => f.draw({ width, height, ctx, children: [] }, { x: offset.x + x, y: offset.y + y }));
            }
        });
    });

</script>

{@render children?.()}