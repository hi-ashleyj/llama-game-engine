<script lang="ts">

    import type { Writable } from "svelte/store";
    import { onMount } from "svelte";
    import { Game, Layer, type GameContext } from "../../../lib";
    import BackgroundLayer from "./BackgroundLayer.svelte";
    import OtherLayer from "./OtherLayer.svelte";

    let context: GameContext;
    let timerStore: Writable<number> & { stop: () => any }

    onMount(() => {
        timerStore = context?.createTimer({ duration: 3000, repeats: 0 });
        return timerStore.stop;
    })

</script>

<div class="game-wrapper">
    <Game bind:context={context}>
        <Layer zIndex={0} staticMode={true} name="bg">
            <BackgroundLayer hue={$timerStore}/>
        </Layer>
        <Layer zIndex={1} name="help">
            <OtherLayer hue={$timerStore} />
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