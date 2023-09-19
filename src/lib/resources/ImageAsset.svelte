<script lang="ts">

    import {pushAsset} from "./images.js";
    import { onMount } from "svelte";
    export let url;
    let element;

    onMount(() => {
        if (!element) return;
        pushAsset(url, element);
    })

</script>

<img src={url} alt="A Game Asset" bind:this={element} />