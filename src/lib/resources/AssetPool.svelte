<script lang="ts">
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();</script>

<div class="-llama-asset-pool--">
    {@render children?.()}
</div>

<style>
    .-llama-asset-pool-- {
        display: none;
    }
</style>