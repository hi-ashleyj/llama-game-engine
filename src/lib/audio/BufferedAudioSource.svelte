<script lang="ts">

    import { getAudioContext, getConnector } from "$lib/audio/context.js";
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

    let output: GainNode;
    let sourceNode: MediaElementAudioSourceNode
    let element: HTMLAudioElement;

    $: {
        if (output) {
            output.gain.value = volume;
        }
    }

    const connect = getConnector();

    onMount(() => {
        const audioCtx = audioContext();
        sourceNode = audioCtx.createMediaElementSource(element);
        output = audioCtx.createGain();
        sourceNode.connect(output);
        return connect(output);
    })

</script>

<audio src={url} hidden loop={loop} bind:paused={paused} bind:currentTime={playbackPosition} bind:this={element}/>