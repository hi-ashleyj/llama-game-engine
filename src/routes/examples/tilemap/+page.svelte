<script lang="ts">

    import { Game, Layer, GameObject, Drawables } from "$lib/index.js";
    import MovingBox from "./MovingBox.svelte";

</script>

<div class="game-wrapper">
    <Game>
        <Layer zIndex={0} name="bg">
            <GameObject x={0} y={0} w={1920} h={1080} >
                <Drawables.Rectangle fill="#333333" />
            </GameObject>
        </Layer>
        <Layer zIndex={1} name="ui">
            <MovingBox />
        </Layer>
        <Layer zIndex={2} name="player">
            <GameObject x={960} y={540} w={50} h={50} centered={true}>
                <Drawables.RoundedRectangle fill="white" radius={5} />
            </GameObject>
        </Layer>
    </Game>
</div>

<style lang="scss">
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