<script>
    
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import { onMount, createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    
    export let width = 1920;
    export let height = 1080;
    export let background = "#000000";

    const widthStore = writable(1920);
    const heightStore = writable(1080);
    const backgroundStore = writable("#000000");

    $: { $widthStore = width }
    $: { $heightStore = height }
    $: { $backgroundStore = background }

    const layers = new Set();

    const draw = function(delta, time) {
        for (let layer of layers) {
            layer(delta, time);
        }
    };

    const assign = function(layerDraw) {
        layers.add(layerDraw);
        return () => layers.delete(layerDraw);
    };

    const context = {
        width: widthStore,
        height: heightStore,
        background: backgroundStore,
        assign
    }

    setContext("game", context);

    let last = -1;

    const loop = function(time) {
        if (last < 0) last = time;

        let delta = (time - last);

        if (delta > 1000) {
            requestAnimationFrame(loop);
            return last = time;
        }

        // TODO: NEW TIMEOUT LOGIC

        dispatch("frame", { delta, time });

        draw();

        requestAnimationFrame(loop);
        last = time;
    };

    onMount(() => {
        loop();
    });

</script>

<div class="game">
    <slot />
</div>

<style>
    .game {
        position: relative;
    }
</style>