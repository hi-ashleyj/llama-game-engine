<script lang="ts">
    import { onMount } from "svelte";
    import { pushBufferAsset } from "./audio.js";

    interface Props {
        url: any;
    }

    let { url }: Props = $props();

    onMount(() => {
        pushBufferAsset(url);
    })

</script>