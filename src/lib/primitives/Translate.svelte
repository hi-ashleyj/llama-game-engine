<script lang="ts">

    import { useDrawable } from "../core/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        x: number;
        y: number;
        children?: import('svelte').Snippet;
    }

    let { x, y, children }: Props = $props();

    const register = useDrawable<{x: number, y: number}, {x: number, y: number}>(true);
    onMount(() => {
        return register(({ children }, offset) => {
            children({ x: offset.x + x, y: offset.y + y });
        });
    });

</script>

{@render children?.()}