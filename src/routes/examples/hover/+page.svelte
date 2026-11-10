<script lang="ts" module>

    declare global {
        namespace Llama {
            interface Modules {
                mouse: any;
            }
        }
    }

</script>

<script lang="ts">

    import { Game, Layer, Canvas } from "#lib/index.js";
    import { RoundedRectangle as Rectangle, Text, Area, Opacity } from "#lib/primitive.js";
    import { mouse, MouseClickable, MouseEventArea } from "#lib/mouse.js";
    import Follow from "./Follow.svelte";

    let leftFill = $state("#aa0000");
    let rightFill = $state("#aa0000");
    let pickerFill = $state("#aa0000");
    let hoveringOne: boolean = $state(false);
    let hoverTwoFill = $state("#aa0000");
    let hoveringTwo: boolean = $state(false);

</script>

<div class="game-wrapper">
    <Game font="Comic Sans MS" modules={{ mouse }}>
        <Canvas>
            <Layer z={0} name="bg">
                <Area x={0} y={0} w={1920} h={1080} >
                    <Rectangle fill="#1e1e1e" radius={10} />
                </Area>
            </Layer>
            <Layer z={1} name="ui">
                <Area x={960} y={340} w={500} h={60} center={true}>
                    <Rectangle fill={leftFill} radius={10} />
                    <Text text="Left Click Only" size={20} font="Roboto" fill="white" alignH="center" alignV="middle" />
                    <MouseClickable onleft={() => leftFill = "#00aa00"} />
                </Area>
                <Area x={960} y={440} w={500} h={60} center={true}>
                    <Rectangle fill={rightFill} radius={10} />
                    <Text text="Right Click Only" size={30} font="Roboto" fill="white" alignH="center" alignV="middle" />
                    <MouseClickable onright={() => rightFill = "#00aa00"} />
                </Area>
                <Area x={960} y={540} w={500} h={60} center={true}>
                    <Rectangle fill={pickerFill} radius={10} />
                    <Text text="Colour Depends on Click" size={40} font="Roboto" fill="white" alignH="center" alignV="middle" />
                    <MouseClickable onleft={() => pickerFill = "#00aa00"} onright={() => pickerFill = "#0000aa"} onmiddle={() => pickerFill = "#aa0000"} />
                </Area>
                <Area x={960} y={640} w={500} h={60} center={true}>
                    <Opacity opacity={hoveringOne ? 1 : 0.6}>
                        <Rectangle fill="white" radius={10} />
                        <Text text="Hover Check" size={60} font="Roboto" fill="black" alignH="center" alignV="middle" />
                        <MouseEventArea bind:hover={hoveringOne} />
                    </Opacity>
                </Area>
                <Area x={960} y={740} w={500} h={100} center={true}>
                    <Opacity opacity={hoveringTwo ? 1 : 0.6}>
                        <Rectangle fill={hoverTwoFill} radius={10} />
                        <Text text="Hover + Any Click" size={50} font="Roboto" fill="white" alignH="center" alignV="middle" />
                        <MouseEventArea onclick={() => hoverTwoFill = "#00aa00"} bind:hover={hoveringTwo} />
                    </Opacity>
                </Area>
                <Follow />
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
