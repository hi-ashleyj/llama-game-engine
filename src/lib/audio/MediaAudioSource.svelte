<script lang="ts">

    import { getAudioContext } from "$lib/audio/context.js";
    const audioContext = getAudioContext();

    export let url;
    export let volume;
    export let paused = false;
    export let playbackPosition;
    export let loop;

    let node;

</script>

<audio src={url} hidden loop={loop} bind:paused={paused} />