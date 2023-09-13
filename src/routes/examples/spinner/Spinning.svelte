<script lang="ts">

    import { GameObject, getGame } from "../../../lib";
    import { Arc } from "../../../lib/drawables";
    import { onDestroy } from "svelte";

    const context = getGame();

    let timing = context.createTimer({ duration: 1000, repeats: 0});

    onDestroy(() => {
        timing.stop();
    })

    $: angle = $timing * 360;

</script>

<GameObject x={960} y={540} w={100} h={100} centered={true} >
    <Arc fill="white" startAngle={angle} endAngle={angle + 120} />
</GameObject>