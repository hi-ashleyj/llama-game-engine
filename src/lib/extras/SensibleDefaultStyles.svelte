<script lang="ts">
    let x: HTMLDivElement;
</script>

<div class="game-wrapper" bind:this={x}>
    <slot wrapper={x} />
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