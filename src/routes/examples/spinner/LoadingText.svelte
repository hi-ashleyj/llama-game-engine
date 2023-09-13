<script lang="ts">

    import { onDestroy } from "svelte";
    import { Drawables, GameObject, getGame } from "$lib";

    const context = getGame();

    let timing = context.createTimer({ duration: 3000, repeats: 0});

    onDestroy(() => {
        timing.stop();
    })

    $: dots = ".".repeat(Math.floor($timing * 4));

</script>

<GameObject x={960} y={540 + 200} w={0} h={0} centered={false} >
    <Drawables.MultiLineText text={`loading${dots}\nor whatever`} size={30} alignH="center" fill="white" />
</GameObject>