<script lang="ts">

    import { getAudioContext, getConnector } from "$lib/audio/context.js";
    import { onMount } from "svelte";
    const audioContext = getAudioContext();

    export let gain: number = 1;

    let output: GainNode;

    $: {
        if (output) {
            output.gain.setTargetAtTime(gain, output.context.currentTime, 0.004);
        }
    }

    const connect = getConnector((node) => {
        node.connect(output);
        return () => node.disconnect(output);
    });

    onMount(() => {
        const audioCTX = audioContext();
        output = audioCTX.createGain();
        return connect(output);
    })

</script>

<slot />