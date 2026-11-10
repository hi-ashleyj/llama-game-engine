<script module lang="ts">

    import type { ModuleSetup } from "../core/game.js";
    export interface Props {
        Client: import("svelte").Component<ChildProps>;
        size?: [ number, number ];
        font?: string;
        modules: ModuleSetup;
    }
    export type ChildProps = {
        wrapper?: HTMLDivElement,
    }

</script>

<script lang="ts">

    import Game from "../core/Game.svelte";

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
