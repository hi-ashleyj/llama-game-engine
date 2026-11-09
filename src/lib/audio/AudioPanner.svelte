<script lang="ts">

    import { useAudioCable } from "./context.js";
    import { onMount } from "svelte";

    interface Props {
        pan?: number;
        children?: import('svelte').Snippet;
    }

    let { pan = 0, children }: Props = $props();
    let output: StereoPannerNode | undefined = $state();

    $effect(() => {
        if (output) output.pan.value = pan;
    });

    const { connect, context } = useAudioCable((node) => {
        node.connect(output!);
        return () => node.disconnect(output!);
    });

    onMount(() => {
        output = context().createStereoPanner();
        return connect(output);
    })

</script>

{@render children?.()}