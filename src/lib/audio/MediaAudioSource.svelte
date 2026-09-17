<script lang="ts">

    import { getAudioContext, getConnector } from "./context.js";
    import { onMount } from "svelte";
    const audioContext = getAudioContext();

    interface Props {
        url: string;
        volume?: number;
        paused?: boolean;
        playbackPosition: number;
        loop?: boolean;
    }

    let { url, volume = 1, paused = $bindable(true), playbackPosition = $bindable(), loop = false }: Props = $props();

    let output: GainNode | undefined = $state();
    let sourceNode: MediaElementAudioSourceNode
    let element: HTMLAudioElement | undefined = $state();

    $effect(() => {
        if (output) {
            output.gain.setTargetAtTime(volume, output.context.currentTime, 0.004);
        }
    });

    const connect = getConnector();

    onMount(() => {
        if (!element) { throw new Error("Failed to mount Audio Element"); }
        const audioCTX = audioContext();
        sourceNode = audioCTX.createMediaElementSource(element);
        output = audioCTX.createGain();
        sourceNode.connect(output);
        return connect(output);
    });

</script>

<audio src={url} hidden loop={loop} bind:paused={paused} bind:currentTime={playbackPosition} bind:this={element}></audio>