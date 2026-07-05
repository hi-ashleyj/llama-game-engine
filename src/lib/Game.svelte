<script lang="ts">
    import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import { setupGame, type GameContext, type LayerContext, type LayerDrawable } from "./core-contexts.js";
    import { Timing } from "./controllers/motions.js";
    import { Keyboard } from "./controllers/keyboard.js";
    import type { Writable } from "svelte/store";
    import { Mouse } from "./controllers/mouse.js";
    import { getSetupAudio } from "./audio/context.js";
    import { decodeAllBuffers } from "./resources/audio.js";

    const raise = (err: string) => {
        throw new Error(err);
    }

    interface Props {
        width?: number;
        height?: number;
        background?: string;
        children?: import('svelte').Snippet;
    }

    let {
        width = 1920,
        height = 1080,
        background = "#000000",
        children
    }: Props = $props();

    const widthStore: Writable<number> = writable(1920);
    const heightStore: Writable<number> = writable(1080);
    const backgroundStore: Writable<string> = writable("#000000");

    $effect(() => { $widthStore = width })
    $effect(() => { $heightStore = height })
    $effect(() => { $backgroundStore = background })

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
        node.connect(audio.destination);
        return () => audio && node.disconnect(audio.destination);
    })

    onMount(() => {
        audio = new AudioContext();
        decodeAllBuffers(audio);
        requestAnimationFrame(loop);
        keyboard.start();
        mouse.start();
    });

    let wiw = $state(0);
    let wih = $state(0);

    $effect(() => mouse.changeWindowDimensions(wiw, wih));
    $effect(() => mouse.setHeight(height));
    $effect(() => mouse.setWidth(width));

    const resumeAudioContext = () => {
        if (audio?.state === "suspended") {
            audio?.resume();
        }
    }

</script>

<div class="game" style:background-color={background}>
    {@render children?.()}
</div>

<svelte:window bind:innerHeight={wih} bind:innerWidth={wiw} onclick={resumeAudioContext} onkeydown={resumeAudioContext}></svelte:window>

<style>
    .game {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }
</style>