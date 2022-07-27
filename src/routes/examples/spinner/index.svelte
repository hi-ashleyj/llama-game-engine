<script lang="ts">

    import { Game, Layer, GameObject } from "@hi-ashleyj/llama";
    import { Rectangle } from "@hi-ashleyj/llama/Drawables";
    import type { GameContext } from "@hi-ashleyj/llama/types";

    import { onMount } from "svelte";
    import Spinning from "./_Spinning.svelte";
    import LoadingText from "./_LoadingText.svelte";

    let context: GameContext;
    let xStore;

    onMount(() => {
        xStore = context.createTimer({ duration: 1000, repeats: 0 });
    });

    $: xPosition = 960 + (($xStore - 0.5) * 200);

</script>

<div class="game-wrapper">
    <Game bind:context={context}>
        <Layer zIndex={0}>
            <GameObject x={0} y={0} w={1920} h={1080} >
                <Rectangle fill="#333333" />
            </GameObject>
        </Layer>
        <Layer zIndex={1}>
            <Spinning />
            <LoadingText />
        </Layer>
    </Game>
</div>

<style>
    * {
        box-sizing: border-box;
    }

    :global(html, body) {
        width: 100%;
        height: 100%;
        background: black;
        padding: 0;
        margin: 0;
    }

    .game-wrapper {
        width: 100%;
        height: 100%;
    }
</style>