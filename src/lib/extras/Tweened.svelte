<script lang="ts">
    import { linear } from "svelte/easing";
    import { tweened, type TweenedOptions } from "svelte/motion";

    type Milliseconds = number;

    export let duration: Milliseconds = 200;
    export let value: number = 0;
    export let easing: TweenedOptions<number>["easing"] = linear;

    //@ts-ignore
    const tweening = tweened<number>(null, { duration, easing });

    $: tweening.set(value, { duration, easing })

</script>

<slot smooth={$tweening} />