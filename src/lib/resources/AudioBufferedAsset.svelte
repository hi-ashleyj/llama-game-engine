<script lang="ts">
    import { onMount } from "svelte";
    import { pushBufferAsset } from "./audio.js";

    export let url;

    onMount(() => {
        pushBufferAsset(url);
    })

</script>