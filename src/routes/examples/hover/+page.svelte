<script lang="ts">

    import { Game, Layer, GameObject, MouseLeftClick, MouseClickable, MouseEventArea } from "../../../lib";
    import { RoundedRectangle as Rectangle, Text } from "../../../lib/drawables";
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
                <Rectangle fill="#1e1e1e" radius={10} />
            </GameObject>
        </Layer>
        <Layer zIndex={1}>
            <GameObject x={960} y={340} w={500} h={60} centered={true}>
                <Rectangle fill={leftFill} radius={10} />
                <Text text="Left Click Only" size={20} font="Roboto" fill="white" alignH="center" alignV="middle" />
                <MouseLeftClick on:click={() => leftFill = "#00aa00"} />
            </GameObject>
            <GameObject x={960} y={440} w={500} h={60} centered={true}>
                <Rectangle fill={rightFill} radius={10} />
                <Text text="Right Click Only" size={30} font="Roboto" fill="white" alignH="center" alignV="middle" />
                <MouseClickable on:right={() => rightFill = "#00aa00"} />
            </GameObject>
            <GameObject x={960} y={540} w={500} h={60} centered={true}>
                <Rectangle fill={pickerFill} radius={10} />
                <Text text="Colour Depends on Click" size={40} font="Roboto" fill="white" alignH="center" alignV="middle" />
                <MouseClickable on:left={() => pickerFill = "#00aa00"} on:right={() => pickerFill = "#0000aa"} on:middle={() => pickerFill = "#aa0000"} />
            </GameObject>
            <GameObject x={960} y={640} w={500} h={60} opacity={hoveringOne ? 1 : 0.6} centered={true}>
                <Rectangle fill="white" radius={10} />
                <Text text="Hover Check" size={60} font="Roboto" fill="black" alignH="center" alignV="middle" />
                <MouseEventArea bind:hover={hoveringOne} />
            </GameObject>
            <GameObject x={960} y={740} w={500} h={100} opacity={hoveringTwo ? 1 : 0.6} centered={true}>
                <Rectangle fill={hoverTwoFill} radius={10} />
                <Text text="Hover + Any Click" size={50} font="Roboto" fill="white" alignH="center" alignV="middle" />
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