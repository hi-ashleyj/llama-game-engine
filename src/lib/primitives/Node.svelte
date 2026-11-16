<script lang="ts">

    import { useProps } from "../core/layer.svelte.js";
    import { useDrawable } from "../core/drawable.js";
    import { onMount } from "svelte";

    let { children, ...props }: { x: number; y: number; children?: import('svelte').Snippet; } = $props();
    
    useProps(() => props);
    const register = useDrawable<null, { x: number, y: number }>(true);
    onMount(() => {
        return register(({ children }) => {
            children({ x: props.x, y: props.y });
        });
    });

</script>

{@render children?.()}