<script lang="ts">
    
    import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import { setupGame, type GameContext, type LayerContext, type LayerDrawable } from "./core-contexts.js";
    import { Timing } from "./controllers/motions.js";
    import { Controller } from "./controllers/keyboard.js";
    import type { Writable } from "svelte/store";
    import { Mouse } from "./components/mouse.js";

    export let width = 1920;
    export let height = 1080;
    export let background = "#000000";

    const widthStore: Writable<number> = writable(1920);
    const heightStore: Writable<number> = writable(1080);
    const backgroundStore: Writable<string> = writable("#000000");

    $: { $widthStore = width }
    $: { $heightStore = height }
    $: { $backgroundStore = background }

    const layerDrawables = new Set<LayerDrawable>();
    const layerAssignments = new Map<string, LayerContext>();

    const draw = function() {
        for (let layer of layerDrawables) {
            if (layer.isStatic()) continue;
            layer.draw();
        }
    };

    const assign = function(ctx: LayerDrawable) {
        layerDrawables.add(ctx);
        return () => layerDrawables.delete(ctx);
    };

    const timing = new Timing();
    const controller = new Controller();
    const mouse = new Mouse();

    const frameEvents: Set<Function> = new Set();
    const frameBeforeEvents: Set<Function> = new Set();
    const frameAfterEvents: Set<Function> = new Set();

    export const context: GameContext = {
        width: widthStore,
        height: heightStore,
        background: backgroundStore,
        assign,
        createTimer: timing.createTimer.bind(timing),
        createBurst: timing.createBurst.bind(timing),
        onKeyboardEvent: controller.on.bind(controller),
        isKeyboardPressed: controller.isPressed.bind(controller),
        getKeyboardStore: controller.getStore.bind(controller),
        onMouseEvent: mouse.on.bind(mouse),
        isMousePressed: mouse.isPressed.bind(mouse),
        getMousePosition: mouse.getPosition.bind(mouse),
        getMouseStore: mouse.getStore.bind(mouse),
        onFrame: (callback: Function) => {
            frameEvents.add(callback);
            return () => frameEvents.delete(callback);
        },
        onBeforeFrame: (callback: Function) => {
            frameBeforeEvents.add(callback);
            return () => frameBeforeEvents.delete(callback);
        },
        onAfterFrame: (callback: Function) => {
            frameAfterEvents.add(callback);
            return () => frameAfterEvents.delete(callback);
        },
    }

    setupGame(context);

    let last = -1;

    const loop = function(time: DOMHighResTimeStamp) {
        if (last < 0) last = time;

        let delta = (time - last);

        if (delta > 1000) {
            requestAnimationFrame(loop);
            return last = time;
        }

        // TODO: NEW TIMEOUT LOGIC

        frameBeforeEvents.forEach((callback) => callback({ delta, time }));

        timing.update(delta);

        frameEvents.forEach((callback) => callback({ delta, time }));

        draw();

        frameAfterEvents.forEach((callback) => callback({ delta, time }));

        requestAnimationFrame(loop);
        last = time;
    };

    onMount(() => {
        requestAnimationFrame(loop);
        controller.start();
        mouse.start();
    });

    let wiw = 0;
    let wih = 0;

    $: {
        mouse.changeWindowDimensions(wiw, wih);
    }

    $: {
        mouse.setHeight(height);
    }

    $: {
        mouse.setWidth(width);
    }

</script>

<div class="game" style:background-color={background}>
    <slot />
</div>

<svelte:window bind:innerHeight={wih} bind:innerWidth={wiw}></svelte:window>

<style>
    .game {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }
</style>