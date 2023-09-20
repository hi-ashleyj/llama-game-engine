<script lang="ts">

    import { getAudioContext, getConnector } from "$lib/audio/context.js";
    import { onMount } from "svelte";
    const audioContext = getAudioContext();

    export let preGain: number = 1;
    export let postGain: number = 1;

    type Millisecond = number;
    type Decibel = number;
    export let attack: Millisecond = 10;
    export let threshold: Decibel = -6;
    export let blend: Decibel = 3;
    export let ratio: number = 2;
    export let release: Millisecond = 150;

    let output: GainNode;
    let input: GainNode;
    let process: DynamicsCompressorNode;

    $: {
        if (output) {
            output.gain.setTargetAtTime(postGain, audioCTX.currentTime, 0.004);
        }
    }
    $: {
        if (input) {
            input.gain.setTargetAtTime(preGain, audioCTX.currentTime, 0.004);
        }
    }
    $: {
        if (process) {
            process.attack.setTargetAtTime(attack / 1000, audioCTX.currentTime, 0.004);
            process.threshold.setTargetAtTime(threshold, audioCTX.currentTime, 0.004);
            process.knee.setTargetAtTime(Math.min(threshold + blend, 0), audioCTX.currentTime, 0.004);
            process.ratio.setTargetAtTime(ratio, audioCTX.currentTime, 0.004);
            process.release.setTargetAtTime(release / 1000, audioCTX.currentTime, 0.004);
        }
    }

    const connect = getConnector((node) => {
        node.connect(output);
        return () => node.disconnect(output);
    });

    onMount(() => {
        const audioCTX = audioContext();
        output = audioCTX.createGain();
        input = audioCTX.createGain();
        process = audioCTX.createDynamicsCompressor();
        return connect(output);
    })

</script>

<slot />