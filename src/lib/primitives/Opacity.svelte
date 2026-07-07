<script lang="ts">

    import { setupDrawable } from "../drawable.js";
    import { onMount } from "svelte";

    interface Props {
        opacity: number;
        children?: import('svelte').Snippet;
    }

    let { opacity, children }: Props = $props();
    let register = setupDrawable<any, any>({ hasChildren: true });

    onMount(() => {
        return register({
            draw: ({ width, height, children, ctx }, pass) => {
                if (opacity <= 0) return;
                ctx.globalAlpha = Math.min(opacity, 1);
                children.forEach(f => f.draw({ width, height, ctx, children: [] }, pass));
                ctx.globalAlpha = 1;
            }
        });
    });

</script>

{@render children?.()}