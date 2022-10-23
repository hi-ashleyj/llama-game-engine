<script lang="ts">

    import { setupDrawable } from "$lib/setup";
    import type { DrawableFunction } from "$lib/types/contexts";
    import { onMount } from "svelte";

    export let image: HTMLImageElement | null = null;
    export let crop: { x: number, y: number, w: number, h: number } | null = null;
    
    const draw: DrawableFunction = function({ ctx }, { x, y, w, h }: { x: number, y: number, w: number, h: number }) {
        if (!image) return;
        if (crop) {
            return ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, x, y, w, h);
        }
        ctx.drawImage(image, x, y, w, h);
    };

    let register = setupDrawable({});

    onMount(() => {
        return register(draw);
    })
    
</script>