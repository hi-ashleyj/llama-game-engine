<script lang="ts">

    import { getAudioContext, getConnector } from "$lib/audio/context.js";
    import { onMount } from "svelte";
    const audioContext = getAudioContext();

    export let pan: number = 0;

    let output: StereoPannerNode;

    $: {
        if (output) {
            output.pan.value = pan;
        }
    }

    const connect = getConnector((node) => {
        node.connect(output);
        return () => node.disconnect(output);
    });

    onMount(() => {
        const audioCtx = audioContext();
        output = audioCtx.createStereoPanner();
        return connect(output);
    })

</script>

<slot />