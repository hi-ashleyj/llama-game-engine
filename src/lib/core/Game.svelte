<script lang="ts">
    import type { AvailableModules } from "./registry.js";

    import { onMount, tick } from "svelte";
    import { setupGame, type ModuleSetup, type CurrentModules, type ModuleInitialiser } from "./game.js";

    const raise = (str: string) => { throw new Error(str); };
    type Ready<T extends CurrentModules = CurrentModules> = { id: T, go: ReturnType<ModuleInitialiser<AvailableModules[T]>> };

    interface Props {
        size?: [ number, number ];
        font?: string;
        children?: import('svelte').Snippet;
        modules: ModuleSetup;
    }

    let { size = [ 1920, 1080 ], font, children, modules }: Props = $props();
    let element: HTMLDivElement | undefined = $state();
    let warm = $state(false);

    type FrameCallback = (info: { delta: number, time: number }) => any | void;
    const events: { [K in "frame" | "before" | "after" | "update" | "draw"]: Set<FrameCallback> } = {
        before: new Set(),
        update: new Set(),
        frame: new Set(),
        draw: new Set(),
        after: new Set(),
    };

    let plugins: { [ K in CurrentModules ]: () => AvailableModules[K] } | null = null;
    const context: Llama.GameContext = {
        size: () => size,
        font: () => font,
        root: () => element,

        on: (type: "frame" | "before" | "after", callback: (info: { delta: number, time: number }) => any | void) => {
            events[type].add(callback);
            return () => events[type].delete(callback);
        },
        get: (plugin) => {
            return plugins?.[plugin]?.() ?? raise(`Cannot fetch plugin ${plugin} at this time`);
        }
    }

    setupGame(context);

    const installed = Object.entries(modules).map(([ k, v ]) => ({ id: k, go: v(context) }) as Ready);
    plugins = Object.fromEntries(installed.map(({ id, go }) => [ id, go.fetch ])) as { [ K in CurrentModules ]: () => AvailableModules[K] };

    let last = $state(-1);

    const loop = function(time: DOMHighResTimeStamp) {
        if (last < 0) last = time;
        const delta = (time - last);
        const event = { delta: delta + 0, time: time + 0 };
        last = time;

        if (delta > 1000) return requestAnimationFrame(loop);

        events.before.forEach(it => it(event));
        events.update.forEach(it => it(event));
        events.frame.forEach(it => it(event));
        events.draw.forEach(it => it(event));
        events.after.forEach(it => it(event));

        return requestAnimationFrame(loop);
    };

    onMount(() => {
        const stop = installed.map(({ go }) => go.start());
        requestAnimationFrame(loop);
        tick().then(() => warm = true);
        return () => stop.forEach(it => it());
    });

</script>

<div class="game" bind:this={element}>
    {#if warm}
        {@render children?.()}
    {/if}
</div>

<style>
    .game {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }
</style>