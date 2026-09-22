<script module lang="ts">

    export type ChildProps = {
        wrapper?: HTMLDivElement,
    }

</script>

<script lang="ts">

    import type { Component, ComponentProps } from "svelte";
    import Game from "$lib/Game.svelte";

    interface Props extends Omit<ComponentProps<typeof Game>, "children"> {
        Client: Component<ChildProps>;
    }

    let { Client, ...rest }: Props = $props();
    let x: HTMLDivElement | undefined = $state();

</script>

<div class="game-wrapper" bind:this={x}>
    <Game {...rest}>
        <Client wrapper={x} />
    </Game>
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