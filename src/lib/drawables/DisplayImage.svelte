<script lang="ts">

    import { setupDrawable, type DrawFunction} from "$lib/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        image?: HTMLImageElement | null;
        crop?: { x: number, y: number, w: number, h: number } | null;
    }

    let { image = null, crop = null }: Props = $props();
    
    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function({ ctx }, { x, y, w, h }: { x: number, y: number, w: number, h: number }) {
        if (!image) return;
        if (crop) {
            return ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, x, y, w, h);
        }
        ctx.drawImage(image, x, y, w, h);
    };

    let register = setupDrawable<{x: number, y: number, w: number, h: number}, null>({});

    onMount(() => {
        return register({ draw });
    })
    
</script>