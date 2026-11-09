<script lang="ts">

    import { useDrawable } from "../core/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
        children?: import('svelte').Snippet;
    }

    let {
        left = 0,
        right = 0,
        top = 0,
        bottom = 0,
        children
    }: Props = $props();

    const register = useDrawable<{x: number, y: number, w: number, h: number}, {x: number, y: number, w: number, h: number}>(true);
    onMount(() => {
        return register(({ children }, o) => {
            children({
                x: o.x + left, 
                y: o.y + top, 
                w: o.w - (left + right), 
                h: o.h - (top + bottom),
            })
        });
    });

</script>

{@render children?.()}