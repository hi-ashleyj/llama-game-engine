<script lang="ts">

    import { getAudioContext, getConnector } from "$lib/audio/context.js";
    import { onMount } from "svelte";
    const audioContext = getAudioContext();

    export let gain: number = 0;

    let output: GainNode;

    $: {
        if (output) {
            output.gain.value = gain;
        }
    }

    const connect = getConnector((node) => {
        node.connect(output);
        return () => node.disconnect(output);
    });

    onMount(() => {
        const audioCtx = audioContext();
        output = audioCtx.createGain();
        return connect(output);
    })

</script>

<slot />