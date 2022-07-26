<script lang="ts">

    import { Game } from "@hi-ashleyj/llama/index";

    const frameHandler = function(delta, time) {
        
    };

</script>

<div class="game-wrapper">
    <Game on:frame={frameHandler}>

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