<script lang="ts">

    import { Game, Layer, GameObject } from "../../../lib";
    import { Rectangle } from "../../../lib/drawables";
    import type { GameContext } from "../../../lib/types";

    import { onMount } from "svelte";
    import MovingBox from "./Area.svelte";

    let context: GameContext;
    let xStore;

    onMount(() => {
        xStore = context.createTimer({ duration: 1000, repeats: 0 });
    });

    $: xPosition = 960 + (($xStore - 0.5) * 200);

    let frame = () => {};

</script>

<div class="game-wrapper">
    <Game bind:context={context}>
        <Layer zIndex={0}>
            <GameObject x={0} y={0} w={1920} h={1080} >
                <Rectangle fill="#333333" />
            </GameObject>
        </Layer>
        <Layer zIndex={1}>
            <MovingBox />
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