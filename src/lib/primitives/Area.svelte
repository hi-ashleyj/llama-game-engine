<script lang="ts">

    import { setupDrawable } from "../drawable.js";
    import { onMount } from "svelte";

    interface Props { x?: number; y?: number; w: number; h: number; center?: boolean; children?: import('svelte').Snippet; }
    let { x = 0, y = 0, w, h, center = false, children }: Props = $props();

    let register = setupDrawable<{x: number, y: number}, {x: number, y: number, w: number, h: number}>({ hasChildren: true });

    onMount(() => {
        return register({
            draw: ({ children, width, height, ctx }, offsets) => {
                const vX = x + (offsets?.x ?? 0) - (center ? w / 2 : 0);
                const vY = y + (offsets?.y ?? 0) - (center ? h / 2 : 0);

                children.forEach(f => f.draw({ width, height, ctx, children: [] }, { x: vX, y: vY, w, h }))
            }
        });
    });

</script>

{@render children?.()}