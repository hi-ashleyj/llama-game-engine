<script lang="ts">

    import {pushAsset} from "./images.js";
    import { onMount } from "svelte";
    interface Props {
        url: any;
    }

    let { url }: Props = $props();
    let element = $state();

    onMount(() => {
        if (!element) return;
        pushAsset(url, element);
    })

</script>

<img src={url} alt="A Game Asset" bind:this={element} />