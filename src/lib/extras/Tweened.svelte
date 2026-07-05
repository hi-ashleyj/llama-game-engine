<script lang="ts">
    import { linear } from "svelte/easing";
    import { Tween, type TweenOptions } from "svelte/motion";

    type Milliseconds = number;

    interface Props {
        duration?: Milliseconds;
        value?: number;
        easing?: TweenOptions<number>["easing"];
        children?: import('svelte').Snippet<[{ smooth: number }]>;
    }

    let {
        duration = 200,
        value = 0,
        easing = linear,
        children
    }: Props = $props();

    //@ts-ignore
    const tween = new Tween<number>(value, { duration, easing });

    $effect(() => {
        tween.set(value, { duration, easing });
    });

</script>

{@render children?.({ smooth: tween.current })}