<script lang="ts">
    
    import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import { setupGame, type GameContext, type LayerContext, type LayerDrawable } from "./core-contexts.js";
    import { Timing } from "./controllers/motions.js";
    import { Keyboard } from "./controllers/keyboard.js";
    import type { Writable } from "svelte/store";
    import { Mouse } from "./controllers/mouse.js";
    import { getSetupAudio } from "$lib/audio/context.js";

    const raise = (err: string) => {
        throw new Error(err);
    }

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

    const assign = function(ctx: LayerContext, obj: LayerDrawable) {
        layerDrawables.add(obj);
        layerAssignments.set(obj.name, ctx);
        return () => { 
            layerDrawables.delete(obj);
            layerAssignments.delete(obj.name); 
        };
    };

    const timing = new Timing();
    const keyboard = new Keyboard();
    const mouse = new Mouse();

    const frameEvents: Set<(info: { delta: number, time: number }) => any | void> = new Set();
    const frameBeforeEvents: Set<(info: { delta: number, time: number }) => any | void> = new Set();
    const frameAfterEvents: Set<(info: { delta: number, time: number }) => any | void> = new Set();

    export const context: GameContext = {
        width: widthStore,
        height: heightStore,
        background: backgroundStore,
        getLayerByName: (name) => layerAssignments.get(name) ?? null,
        assign,
        createTimer: timing.createTimer.bind(timing),
        createBurst: timing.createBurst.bind(timing),
        onKeyboardEvent: keyboard.on.bind(keyboard),
        isKeyboardPressed: keyboard.isPressed.bind(keyboard),
        getKeyboardStore: keyboard.getStore.bind(keyboard),
        onMouseEvent: mouse.on.bind(mouse),
        isMousePressed: mouse.isPressed.bind(mouse),
        getMousePosition: mouse.getPosition.bind(mouse),
        getMouseStore: mouse.getStore.bind(mouse),
        onFrame: (callback) => {
            frameEvents.add(callback);
            return () => frameEvents.delete(callback);
        },
        onBeforeFrame: (callback) => {
            frameBeforeEvents.add(callback);
            return () => frameBeforeEvents.delete(callback);
        },
        onAfterFrame: (callback) => {
            frameAfterEvents.add(callback);
            return () => frameAfterEvents.delete(callback);
        },
        defaultTextFontFace: writable(null),
        getAudioContext: () => audio ? audio : raise("There Is No AudioContext"),
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

    let audio: AudioContext | null = null;
    getSetupAudio((node) => {
        if (!audio) throw new Error("Audio Is Not Yet Created!")
        audio.destination.connect(node);
        return () => audio.destination.disconnect(node);
    })

    onMount(() => {
        audio = new AudioContext();
        requestAnimationFrame(loop);
        keyboard.start();
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

    const resumeAudioContext = () => {
        if (audio.state === "suspended") {
            audio.resume();
        }
    }

</script>

<div class="game" style:background-color={background}>
    <slot />
</div>

<svelte:window bind:innerHeight={wih} bind:innerWidth={wiw} on:click={resumeAudioContext} on:keydown={resumeAudioContext}></svelte:window>

<style>
    .game {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }
</style>