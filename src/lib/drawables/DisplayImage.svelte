<script lang="ts">

    import { setupDrawable } from "$lib/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        image?: HTMLImageElement | null;
        crop?: { x: number, y: number, w: number, h: number } | null;
    }

    let { image = null, crop = null }: Props = $props();
    let register = setupDrawable<{x: number, y: number, w: number, h: number}, null>({ hasChildren: false });

    onMount(() => {
        return register({
            draw: ({ ctx }, { x, y, w, h }) => {
                if (!image) return;
                if (crop) {
                    return ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, x, y, w, h);
                }
                ctx.drawImage(image, x, y, w, h);
            }
        });
    })
    
</script>