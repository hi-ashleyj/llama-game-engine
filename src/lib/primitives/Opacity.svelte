<script lang="ts">

    import { useDrawable } from "../core/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        opacity: number;
        absolute?: boolean;
        children?: import('svelte').Snippet;
    }

    let { opacity, children }: Props = $props();
    
    const register = useDrawable<any, any>(true);
    onMount(() => {
        return register(({ children, ctx }, pass) => {
            if (opacity <= 0) return;
            ctx.globalAlpha = Math.min(opacity, 1);
            children(pass);
            ctx.globalAlpha = 1;
        });
    });

</script>

{@render children?.()}