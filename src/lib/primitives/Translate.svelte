<script lang="ts">

    import { useProps } from "../core/layer-context.svelte.js";
    import { useDrawable } from "../core/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        x: number;
        y: number;
        children?: import('svelte').Snippet;
    }

    let { children, ...props }: Props = $props();
    useProps(() => props);

    const register = useDrawable<{x: number, y: number}, {x: number, y: number}>(true);
    onMount(() => {
        return register(({ children }, offset) => {
            children({ x: offset.x + props.x, y: offset.y + props.y });
        });
    });

</script>

{@render children?.()}