<script lang="ts">

    import { Node, Area, Rectangle } from "#lib/primitive.js";
    import { useTimer } from "#lib/timers.js";
    import { onMount } from "svelte";

    const timer = useTimer({ duration: 1000, repeats: 0 });
    let x = $derived(timer.value * 1920);

    const size = 50;

    onMount(() => {
        return timer.start();
    })

</script>

<Node x={x} y={540} >
    <Area w={size} h={size} center>
        <Rectangle fill="white" />
    </Area>
</Node>

<style>

</style>