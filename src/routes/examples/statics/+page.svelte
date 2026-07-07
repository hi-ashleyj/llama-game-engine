<script lang="ts">

    import { Game, Layer } from "$lib/index.js";
    import BackgroundLayer from "./BackgroundLayer.svelte";
    import OtherLayer from "./OtherLayer.svelte";

</script>

<div class="game-wrapper">
    <Game>
        <Layer zIndex={0} staticMode={true} name="bg">
            <BackgroundLayer/>
        </Layer>
        <Layer zIndex={1} name="help">
            <OtherLayer />
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