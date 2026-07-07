<script lang="ts">

    import { Game, Layer, Drawables, Primitives } from "$lib/index.js";
    import { Rectangle } from "$lib/drawables/index.js";

    import Spinning from "./Spinning.svelte";
    import LoadingText from "./LoadingText.svelte";

</script>

<div class="game-wrapper">
    <Game>
        <Layer zIndex={0} name="bg">
            <Primitives.Area x={0} y={0} w={1920} h={1080} >
                <Drawables.Rectangle fill="#333333" />
            </Primitives.Area>
        </Layer>
        <Layer zIndex={1} name="oh">
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