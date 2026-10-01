<script lang="ts">
    import ResourceImage from './ResourceImage.svelte';
    import ResourceFont from "./ResourceFont.svelte";

    interface Props {
        children?: import('svelte').Snippet<[ number, number, number ]>;
        images?: string[];
        playback?: string[];
        fonts?: Record<string, string>;
    }

    let { children, images, playback, fonts }: Props = $props();

    let loaded: string[] = $state([]);
    let imagesDeduped = $derived([ ...new Set(images ?? []) ]);
    let playbackDeduped = $derived([ ...new Set(playback ?? []) ]);
    let fontDerived = $derived(Object.entries(fonts ?? {}));

    let count = $derived(imagesDeduped.length + playbackDeduped.length + fontDerived.length);
    let percentage = $derived(loaded.length / count);
    let ready = $derived(loaded.length >= count);
</script>

{@render children?.(percentage, count, loaded.length)}

<div class="-llama-asset-pool--">
    {#each imagesDeduped as url (url)}
        <ResourceImage {url} onload={() => loaded.some(it => it === url) ? null : loaded.push(url) } />
    {/each}
    {#each fontDerived as [ url, font ] (url)}
        <ResourceFont {font} {url} onload={() => loaded.some(it => it === url) ? null : loaded.push(url) } />
    {/each}
</div>

<style>
    .-llama-asset-pool-- {
        display: none;
    }
</style>