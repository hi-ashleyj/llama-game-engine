<script lang="ts">

    import { getAudioContext, getConnector } from "$lib/audio/context.js";
    import { onMount } from "svelte";
    const audioContext = getAudioContext();

    type Millisecond = number;
    type Decibel = number;
    interface Props {
        preGain?: number;
        postGain?: number;
        attack?: Millisecond;
        threshold?: Decibel;
        blend?: Decibel;
        ratio?: number;
        release?: Millisecond;
        children?: import('svelte').Snippet;
    }

    let {
        preGain = 1,
        postGain = 1,
        attack = 10,
        threshold = -6,
        blend = 3,
        ratio = 2,
        release = 150,
        children
    }: Props = $props();

    let output: GainNode | undefined = $state();
    let input: GainNode | undefined = $state();
    let process: DynamicsCompressorNode | undefined = $state();

    $effect(() => {
        if (output) {
            output.gain.setTargetAtTime(postGain, output.context.currentTime, 0.004);
        }
    })

    $effect(() => {
        if (input) {
            input.gain.setTargetAtTime(preGain, input.context.currentTime, 0.004);
        }
    });
    $effect(() => {
        if (process) {
            process.attack.setTargetAtTime(attack / 1000, process.context.currentTime, 0.004);
            process.threshold.setTargetAtTime(threshold, process.context.currentTime, 0.004);
            process.knee.setTargetAtTime(Math.min(threshold + blend, 0), process.context.currentTime, 0.004);
            process.ratio.setTargetAtTime(ratio, process.context.currentTime, 0.004);
            process.release.setTargetAtTime(release / 1000, process.context.currentTime, 0.004);
        }
    });

    const connect = getConnector((node) => {
        node.connect(output!);
        return () => node.disconnect(output!);
    });

    onMount(() => {
        const audioCTX = audioContext();
        output = audioCTX.createGain();
        input = audioCTX.createGain();
        process = audioCTX.createDynamicsCompressor();
        return connect(output);
    })

</script>

{@render children?.()}