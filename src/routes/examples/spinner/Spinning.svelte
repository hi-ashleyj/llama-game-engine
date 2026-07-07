<script lang="ts">

    import { Primitives, getGame } from "$lib/index.js";
    import { Arc } from "$lib/drawables/index.js";
    import { onDestroy } from "svelte";

    const context = getGame();

    let timing = context.createTimer({ duration: 1000, repeats: 0});

    onDestroy(() => {
        timing.stop();
    })

    let angle = $derived($timing * 360);

</script>

<Primitives.Area x={960} y={540} w={100} h={100} center={true} >
    <Arc fill="white" startAngle={angle} endAngle={angle + 120} />
</Primitives.Area>