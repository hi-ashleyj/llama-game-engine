<script lang="ts">

    import { useAudioCable } from "./context.js";
    import { onMount } from "svelte";

    interface Props {
        gain?: number;
        children?: import('svelte').Snippet;
    }

    let { gain = 1, children }: Props = $props();
    let output: GainNode | undefined = $state();

    $effect(() => { if (output) output.gain.setTargetAtTime(gain, output.context.currentTime, 0.004); });

    const { connect, context } = useAudioCable((node) => {
        node.connect(output!);
        return () => node.disconnect(output!);
    });

    onMount(() => {
        output = context().createGain();
        return connect(output);
    })

</script>

{@render children?.()}