<script lang="ts">

    import { useProps } from "../core/layer-context.svelte.js";
    import { useDrawable } from "../core/drawable.js";
    import { onMount } from "svelte";

    interface Props {
        opacity: number;
        absolute?: boolean;
        enforced?: boolean;
        children?: import('svelte').Snippet;
    }

    let { children, ...props }: Props = $props();
    
    useProps(() => props);
    const register = useDrawable<any, any>(true);
    onMount(() => {
        return register(({ children, ctx }, pass) => {
            if (props.opacity <= 0 && !props.enforced) return;
            const last = ctx.globalAlpha + 0;
            ctx.globalAlpha = Math.max(Math.min(props.absolute ? props.opacity : last * props.opacity, 1), 0);
            children(pass);
            ctx.globalAlpha = last;
        });
    });

</script>

{@render children?.()}