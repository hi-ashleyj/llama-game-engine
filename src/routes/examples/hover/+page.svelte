<script lang="ts">

    import { Game, Layer, GameObject, MouseLeftClick, MouseClickable, MouseEventArea } from "../../../lib";
    import { Rectangle } from "../../../lib/drawables";
    import Follow from "./Follow.svelte";

    let leftFill = "#aa0000";
    let rightFill = "#aa0000";
    let pickerFill = "#aa0000";
    let hoveringOne;
    let hoverTwoFill = "#aa0000";
    let hoveringTwo;

</script>

<div class="game-wrapper">
    <Game>
        <Layer zIndex={0}>
            <GameObject x={0} y={0} w={1920} h={1080} >
                <Rectangle fill="#1e1e1e" />
            </GameObject>
        </Layer>
        <Layer zIndex={1}>
            <GameObject x={960} y={340} w={500} h={60} centered={true}>
                <Rectangle fill={leftFill} />
                <MouseLeftClick on:click={() => leftFill = "#00aa00"} />
            </GameObject>
            <GameObject x={960} y={440} w={500} h={60} centered={true}>
                <Rectangle fill={rightFill} />
                <MouseClickable on:right={() => rightFill = "#00aa00"} />
            </GameObject>
            <GameObject x={960} y={540} w={500} h={60} centered={true}>
                <Rectangle fill={pickerFill} />
                <MouseClickable on:left={() => pickerFill = "#00aa00"} on:right={() => pickerFill = "#0000aa"} on:middle={() => pickerFill = "#aa0000"} />
            </GameObject>
            <GameObject x={960} y={640} w={500} h={60} opacity={hoveringOne ? 1 : 0.6} centered={true}>
                <Rectangle fill="white" />
                <MouseEventArea bind:hover={hoveringOne} />
            </GameObject>
            <GameObject x={960} y={740} w={500} h={60} opacity={hoveringTwo ? 1 : 0.6} centered={true}>
                <Rectangle fill={hoverTwoFill} />
                <MouseEventArea on:click={() => hoverTwoFill = "#00aa00"} bind:hover={hoveringTwo} />
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