<script lang="ts">
    interface Props {
        children?: import('svelte').Snippet<[any]>;
    }

    let { children }: Props = $props();
    let x: HTMLDivElement | undefined = $state();
</script>

<div class="game-wrapper" bind:this={x}>
    {@render children?.({ wrapper: x, })}
</div>

<style>
    * {
        box-sizing: border-box;
    }

    :global(html, body) {
        width: 100%;
        height: 100%;
        background: black;
        padding: 0;
        margin: 0;
    }

    .game-wrapper {
        width: 100%;
        height: 100%;
    }
</style>