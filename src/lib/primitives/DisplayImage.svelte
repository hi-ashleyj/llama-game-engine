<script lang="ts" module>
    export interface Props {
        image?: HTMLImageElement;
        crop?: { x: number, y: number, w: number, h: number };
    }
</script>
<script lang="ts">

    import { useProps } from "../core/layer-context.svelte.js";
    import { useDrawable } from "../core/drawable.js";
    import { onMount } from "svelte";

    let props: Props = $props();
    
    useProps(() => props);
    const register = useDrawable<{x: number, y: number, w: number, h: number}, null>();
    onMount(() => {
        return register(({ ctx }, { x, y, w, h }) => {
            if (!props.image) return;
            if (props.crop) {
                return ctx.drawImage(props.image, props.crop.x, props.crop.y, props.crop.w, props.crop.h, x, y, w, h);
            }
            ctx.drawImage(props.image, x, y, w, h);
        });
    })
    
</script>