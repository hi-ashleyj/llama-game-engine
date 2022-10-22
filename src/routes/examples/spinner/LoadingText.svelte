<script lang="ts">

    import { GameObject } from "../../../lib";
    import { Text } from "../../../lib/drawables";
    import { getGame } from "../../../lib";
    import { onDestroy } from "svelte";

    const context = getGame();

    let timing = context.createTimer({ duration: 3000, repeats: 0});

    onDestroy(() => {
        timing.stop();
    })

    $: dots = ".".repeat(Math.floor($timing * 4));

</script>

<GameObject x={960} y={540 + 200} w={0} h={0} centered={false} >
    <Text text={`loading${dots}`} size={30} font="sans-serif" alignH="center" fill="white" />
</GameObject>