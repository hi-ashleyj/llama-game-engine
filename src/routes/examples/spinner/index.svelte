<script lang="ts">

    import { Game, Layer } from "@hi-ashleyj/llama";

    const frameHandler = function(e: CustomEvent<{ delta: number, time: DOMHighResTimeStamp }>) {
        let { delta, time } = e.detail;
    };

</script>

<div class="game-wrapper">
    <Game on:frame={frameHandler}>
        <Layer zIndex={0}>
            
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