<script lang="ts">

    import { onDestroy } from "svelte";
    import { Drawables, Primitives, getGame } from "$lib/index.js";

    const context = getGame();

    let timing = context.createTimer({ duration: 3000, repeats: 0});

    onDestroy(() => {
        timing.stop();
    })

    let dots = $derived(".".repeat(Math.floor($timing * 4)));

</script>

<Primitives.Area x={960} y={540 + 200} w={0} h={0} center={true}>
    <Drawables.MultiLineText text={`loading${dots}\nor whatever`} size={30} alignH="center" fill="white" />
</Primitives.Area>