<script lang="ts">

    import { Game, Canvas, Layer } from "#lib/index.js";
    import { Rectangle, Node, Area } from "#lib/primitive.js";
    import { timers } from "#lib/timers.js";

    import MovingBox from "./MovingBox.svelte";

</script>

<div class="game-wrapper">
    <Game modules={{ timers }} size={[ 1920, 1080 ]}>
        <Canvas mode="manual">
            <Layer name="background">
                <Node x={0} y={0}>
                    <Area w={1920} h={1080}>
                        <Rectangle fill="#333333" />
                    </Area>
                </Node>
            </Layer>
        </Canvas>
        <Canvas mode="calculated">
            <Layer name="box">
                <MovingBox />
            </Layer>
        </Canvas>
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
        aspect-ratio: 16 / 9;
    }
</style>