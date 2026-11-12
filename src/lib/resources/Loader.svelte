<script lang="ts">

    import { type Collect } from './collect.svelte.ts';

    interface Props {
        children?: import('svelte').Snippet;
        placeholder?: import('svelte').Snippet<[ number, number, number ]>;
        resources: ReturnType<Collect>;
    }

    let { children, placeholder, resources }: Props = $props();

    // let images = $derived(resources);

    // let loaded = $derived(images.loaded);
    // let count = $derived(images.preloads.length);

    // let percentage = $derived(loaded / count);
    // let ready = $derived(loaded >= count);

</script>

<!-- {#if placeholder && !ready}
    {@render placeholder?.(percentage, count, loaded)}
{:else if (!ready)}

{:else}
    {@render children?.()}
{/if}

<div class="-llama-asset-pool--">
    {#each images.preloads as url (url)}
        <img src={url} onload={() => images.tag(url) } alt="A Game Asset" bind:this={null, (el) => images.push(url, el ? el : null)} />
    {/each}
</div> -->

<style>
    .-llama-asset-pool-- {
        display: none;
    }
</style>