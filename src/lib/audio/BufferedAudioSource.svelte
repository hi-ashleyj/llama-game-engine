<script lang="ts">

    import { getAudioContext, getConnector } from "./context.js";
    import { onMount, untrack } from "svelte";
    const audioContext = getAudioContext();

    interface Props {
        volume?: number;
        audioBuffer: AudioBuffer;
        playing?: boolean;
    }

    let { volume = 1, audioBuffer, playing = $bindable(false) }: Props = $props();

    let output: GainNode | undefined = $state();
    let audioCTX: AudioContext;

    $effect(() => {
        if (output) {
            output.gain.setTargetAtTime(volume, output.context.currentTime, 0.004);
        }
    });

    const active = new Set<AudioBufferSourceNode>();

    let cancel: (() => void) | undefined = $state();
    $effect(() => {
        const c = untrack(() => cancel);
        if (!playing && c) {
            c();
            cancel = undefined;
        }
        else if (playing) cancel = play();
    })

    const play = () => {
        if (!audioBuffer) return;
        const source = audioCTX.createBufferSource();
        source.buffer = audioBuffer;
        source.addEventListener("ended", () => {
            source.disconnect(output!);
            active.delete(source);
        });

        source.connect(output!);
        active.add(source);
        source.start();
        return () => {
            if (active.has(source)) {
                source.stop();
                source.disconnect(output!);
                active.delete(source);
            }
        }
    }

    const connect = getConnector();

    onMount(() => {
        audioCTX = audioContext();
        output = audioCTX.createGain();

        const disconnect = connect(output);
        return () => {
            for (let node of active) {
                node.stop();
                node.disconnect(output!);
            }
            disconnect();
        }
    })

</script>