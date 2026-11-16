<script lang="ts">

    import { useProps } from "../core/layer.svelte.js";
    import { useDrawable } from "../core/drawable.js";
    import { onMount } from "svelte";

    interface Props { x?: number; y?: number; w: number; h: number; center?: boolean; children?: import('svelte').Snippet; }
    let { children, ...props }: Props = $props();

    useProps(() => props);

    const register = useDrawable<{x: number, y: number}, {x: number, y: number, w: number, h: number}>(true);
    onMount(() => {
        return register(({ children }, offsets) => {
            const vX = (offsets?.x ?? 0) + (props?.x ?? 0) - (props.center ? props.w / 2 : 0);
            const vY = (offsets?.y ?? 0) + (props?.y ?? 0) - (props.center ? props.h / 2 : 0);

            children({ x: vX, y: vY, w: props.w, h: props.h });
        });
    });

</script>

{@render children?.()}