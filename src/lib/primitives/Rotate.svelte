<script lang="ts">

    import { useProps } from "../core/layer.svelte.js";
    import { useDrawable } from "../core/drawable.js";
    import { onMount } from "svelte";
    
    interface Props {
        /**
     * FALSE = ANCHOR TOP LEFT
     * TRUE = ANCHOR CENTER
     */
        centered?: boolean;
        degrees: number;
        children?: import('svelte').Snippet;
    }
    let { children, ...props }: Props = $props();

    useProps(() => props);
    const register = useDrawable<{ x: number, y: number, w: number, h: number }, { x: number, y: number, w: number, h: number }>(true);
    onMount(() => {
        return register(({ ctx, children }, { x, y, w, h }) => {
            ctx.translate(x, y);
            ctx.rotate(props.degrees * Math.PI / 180 )
            children({ x: (props.centered) ? w * -0.5 : 0, y: (props.centered) ? h * -0.5 : 0, w, h });
            ctx.resetTransform();
        });
    });
</script>

{@render children?.()}