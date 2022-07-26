<script lang="ts">
    
    import { writable } from "svelte/store";
    import { onMount, createEventDispatcher } from "svelte";
    import { setupGame } from "../setup";
    import type { GameContext } from "../types/contexts";
    import { Timing } from "./motions";

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

    const layers = new Set<Function>();

    const draw = function(delta: number, time: DOMHighResTimeStamp) {
        for (let layer of layers) {
            layer(delta, time);
        }
    };

    const assign = function(layerDraw: Function) {
        layers.add(layerDraw);
        return () => layers.delete(layerDraw);
    };

    const timing = new Timing();

    export const context: GameContext = {
        width: widthStore,
        height: heightStore,
        background: backgroundStore,
        assign,
        createTimer: timing.create.bind(timing)
    }

    setupGame(context);

    let last = -1;

    const loop = function(time: DOMHighResTimeStamp) {
        if (last < 0) last = time;

        let delta = (time - last);

        if (delta > 1000) {
            requestAnimationFrame(loop);
            return last = time;
        }

        // TODO: NEW TIMEOUT LOGIC

        dispatch("beforeframe", { delta, time });

        timing.update(delta);

        dispatch("frame", { delta, time });

        draw(delta, time);
        
        dispatch("afterframe", { delta, time });

        requestAnimationFrame(loop);
        last = time;
    };

    onMount(() => {
        requestAnimationFrame(loop);
    });

</script>

<div class="game" style:background-color={background}>
    <slot />
</div>

<style>
    .game {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }
</style>