<script lang="ts">

    import { tweened } from "svelte/motion";

    type Milliseconds = number;

    export let duration: Milliseconds = 200;
    export let value: number = 0;

    //@ts-ignore
    const tweening = tweened<number>(null, { duration });

    $: tweening.set(value, { duration })

</script>

<slot smooth={$tweening} />