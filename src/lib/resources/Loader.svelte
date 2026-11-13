<script lang="ts">

    import { onMount } from 'svelte';
    import { SvelteSet } from 'svelte/reactivity';
    import { type Collect } from './collect.svelte.ts';

    interface Props {
        children?: import('svelte').Snippet;
        placeholder?: import('svelte').Snippet<[ number, number, number ]>;
        resources: ReturnType<Collect>;
    }

    let { children, placeholder, resources }: Props = $props();

    const loaded = new SvelteSet<string>();
    let preload: { [K: string]: string[] } = $state({});
    
    let count = $derived(Object.values(preload).reduce((p, v) => p + v.length, 0));

    let percentage = $derived(loaded.size / count);
    let ready = $derived(loaded.size >= count);

    onMount(() => {
        preload = resources._loader();
    })

</script>

{#if placeholder && !ready}
    {@render placeholder?.(percentage, count, loaded.size)}
{:else if (!ready)}
    
{:else}
    {@render children?.()}
{/if}

<div class="-llama-asset-pool--">
    {#if "image" in preload}
        {#each preload.image as url (url)}
            <img src={url} onload={() => loaded.add(url) } alt="A Game Asset" bind:this={null, (el) => resources.push(url, el ? el : null)} />
        {/each}
    {/if}
    {#if "audio" in preload}
        {#each preload.audio as url (url)}
            <audio src={url} muted preload="auto" oncanplaythrough={() => loaded.add(url)} bind:this={null, (el) => resources.push(url, el ? url : null)}></audio>
        {/each}
    {/if}
</div>

<style>
    .-llama-asset-pool-- {
        display: none;
    }
</style>