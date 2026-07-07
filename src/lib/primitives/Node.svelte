<script lang="ts">

    import { setupDrawable } from "../drawable.js";
    import { onMount } from "svelte";

    let { x, y, children }: { x: number; y: number; children?: import('svelte').Snippet; } = $props();
    let register = setupDrawable<null, { x: number, y: number }>({ hasChildren: true });

    onMount(() => {
        return register({
            draw: ({ ctx, width, height, children }) => {
                children.forEach(f => f.draw({ width, height, children: [], ctx }, { x, y }))
            }
        });
    });

</script>

{@render children?.()}