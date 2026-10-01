<script lang="ts">

    import { pushAsset } from "./index.js";
    import { onMount } from "svelte";
    interface Props {
        url: string;
        onload?: () => void;
    }

    let { url, onload }: Props = $props();
    let element: HTMLImageElement | undefined = $state();

    onMount(() => {
        if (!element) return;
        pushAsset(url, element);
    })

</script>

<img src={url} alt="A Game Asset" {onload} bind:this={element} />