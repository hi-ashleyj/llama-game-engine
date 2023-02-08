<script lang="ts">

    import { Game, Layer, GameObject, MouseLeftClick } from "../../../lib";
    import { Rectangle } from "../../../lib/drawables";
    import Follow from "./Follow.svelte";
    
    let fills = "#aa0000";

</script>

<div class="game-wrapper">
    <Game>
        <Layer zIndex={0}>
            <GameObject x={0} y={0} w={1920} h={1080} >
                <Rectangle fill="#1e1e1e" />
            </GameObject>
        </Layer>
        <Layer zIndex={1}>
            <GameObject x={960} y={540} w={500} h={200} opacity={0.4} centered={true}>
                <Rectangle fill={fills} />
                <MouseLeftClick on:click={() => fills = "white"} />
            </GameObject>
            <Follow />
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