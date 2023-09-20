<script lang="ts">

    import { getAudioContext, getConnector } from "./context.js";
    import { onMount } from "svelte";
    const audioContext = getAudioContext();

    export let volume: number = 1;
    export let audioBuffer: AudioBuffer;

    let output: GainNode;
    let audioCTX: AudioContext;

    $: {
        if (output) {
            output.gain.setTargetAtTime(volume, output.context.currentTime, 0.004);
        }
    }

    const playing = new Set<AudioBufferSourceNode>();

    export const play = () => {
        if (!audioBuffer) return;
        const source = audioCTX.createBufferSource();
        source.buffer = audioBuffer;
        source.addEventListener("ended", () => {
            source.disconnect(output);
            playing.delete(source);
        });

        source.connect(output);
        playing.add(source);
        source.start();
        return () => {
            if (playing.has(source)) {
                source.stop();
                source.disconnect(output);
                playing.delete(source);
            }
        }
    }

    const connect = getConnector();

    onMount(() => {
        audioCTX = audioContext();
        output = audioCtx.createGain();

        const disconnect = connect(output);
        return () => {
            for (let node of playing) {
                node.stop();
                node.disconnect(output);
            }
            disconnect();
        }
    })

</script>