<script lang="ts">
    import { onMount } from "svelte";
    import { pushBufferAsset } from "../src/lib/resources/audio.js";

    interface Props {
        url: any;
    }

    let { url }: Props = $props();

    onMount(() => {
        pushBufferAsset(url);
    })

</script>