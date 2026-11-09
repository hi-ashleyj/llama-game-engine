<script lang="ts" module>
    export interface Props {
        image?: HTMLImageElement;
        crop?: { x: number, y: number, w: number, h: number };
    }
</script>
<script lang="ts">

    import { useDrawable } from "../core/drawable.js";
    import { onMount } from "svelte";

    let { image, crop }: Props = $props();
    
    const register = useDrawable<{x: number, y: number, w: number, h: number}, null>();
    onMount(() => {
        return register(({ ctx }, { x, y, w, h }) => {
            if (!image) return;
            if (crop) {
                return ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, x, y, w, h);
            }
            ctx.drawImage(image, x, y, w, h);
        });
    })
    
</script>