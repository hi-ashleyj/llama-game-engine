<script lang="ts">

    import { useDrawable } from "../core/drawable.js";
    import { onMount } from "svelte";

    let { x, y, children }: { x: number; y: number; children?: import('svelte').Snippet; } = $props();
    
    const register = useDrawable<null, { x: number, y: number }>(true);
    onMount(() => {
        return register(({ children }) => {
            children({ x, y });
        });
    });

</script>

{@render children?.()}