<script lang="ts">

    import { useProps } from "../core/layer-context.svelte.js";
    import { useDrawable } from "../core/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
        children?: import('svelte').Snippet;
    }

    let { children, ...props }: Props = $props();

    useProps(() => props);

    const register = useDrawable<{x: number, y: number, w: number, h: number}, {x: number, y: number, w: number, h: number}>(true);
    onMount(() => {
        return register(({ children }, o) => {
            children({
                x: o.x + (props.left ?? 0), 
                y: o.y + (props.top ?? 0), 
                w: o.w - ((props.left ?? 0) + (props.right ?? 0)), 
                h: o.h - ((props.top ?? 0) + (props.bottom ?? 0)),
            })
        });
    });

</script>

{@render children?.()}