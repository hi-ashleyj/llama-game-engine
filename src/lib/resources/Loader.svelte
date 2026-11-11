<script lang="ts" module>

    import type { ImageResources } from "./images.svelte.ts";
    export type Resource = {
        image: ImageResources
    }

</script>

<script lang="ts">

    interface Props {
        children?: import('svelte').Snippet;
        placeholder?: import('svelte').Snippet<[ number, number, number ]>;
        resources: Resource;
    }

    let { children, placeholder, resources }: Props = $props();

    let images = $derived(resources.image._loader());

    let loaded = $derived(images.loaded);
    let count = $derived(images.preloads.length);

    let percentage = $derived(loaded / count);
    let ready = $derived(loaded >= count);

</script>

{#if placeholder && !ready}
    {@render placeholder?.(percentage, count, loaded)}
{:else if (!ready)}

{:else}
    {@render children?.()}
{/if}

<div class="-llama-asset-pool--">
    {#each images.preloads as url (url)}
        <img src={url} onload={() => images.tag(url) } alt="A Game Asset" bind:this={null, (el) => images.push(url, el ? el : null)} />
    {/each}
</div>

<style>
    .-llama-asset-pool-- {
        display: none;
    }
</style>