<script lang="ts">

    import { getAudioContext, getConnector } from "./context.js";
    import { onMount } from "svelte";
    const audioContext = getAudioContext();

    export let url: string;
    export let volume: number = 1;
    export let paused = true;
    export let playbackPosition: number;
    export let loop: boolean = false;

    export const playFromStart = () => {
        playbackPosition = 0;
        paused = false;
    }

    export const play = () => {
        paused = false;
    }

    export const pause = () => {
        paused = true;
    }

    let output: GainNode;
    let sourceNode: MediaElementAudioSourceNode
    let element: HTMLAudioElement;

    $: {
        if (output) {
            output.gain.setTargetAtTime(volume, output.context.currentTime, 0.004);
        }
    }

    const connect = getConnector();

    onMount(() => {
        const audioCTX = audioContext();
        sourceNode = audioCTX.createMediaElementSource(element);
        output = audioCTX.createGain();
        sourceNode.connect(output);
        return connect(output);
    });

</script>

<audio src={url} hidden loop={loop} bind:paused={paused} bind:currentTime={playbackPosition} bind:this={element} />