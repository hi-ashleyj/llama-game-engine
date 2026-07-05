<script lang="ts">

    import { getAudioContext, getConnector } from "$lib/audio/context.js";
    import { onMount } from "svelte";
    const audioContext = getAudioContext();

    interface Props {
        pan?: number;
        children?: import('svelte').Snippet;
    }

    let { pan = 0, children }: Props = $props();

    let output: StereoPannerNode = $state();

    $effect(() => {
        if (output) {
            output.pan.value = pan;
        }
    });

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

{@render children?.()}