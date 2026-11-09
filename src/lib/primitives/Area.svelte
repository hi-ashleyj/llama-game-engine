<script lang="ts">

    import { useDrawable } from "../core/drawable.js";
    import { onMount } from "svelte";

    interface Props { x?: number; y?: number; w: number; h: number; center?: boolean; children?: import('svelte').Snippet; }
    let { x = 0, y = 0, w, h, center = false, children }: Props = $props();

    const register = useDrawable<{x: number, y: number}, {x: number, y: number, w: number, h: number}>(true);
    onMount(() => {
        return register(({ children }, offsets) => {
            const vX = x + (offsets?.x ?? 0) - (center ? w / 2 : 0);
            const vY = y + (offsets?.y ?? 0) - (center ? h / 2 : 0);

            children({ x: vX, y: vY, w, h });
        });
    });

</script>

{@render children?.()}