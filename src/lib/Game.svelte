<script lang="ts">
    import { onMount } from "svelte";
    import { setupGame, type LayerContext, type LayerDrawable } from "./context.js";
    import { timers } from "./controllers/motions.svelte.js";
    import { keyboard } from "./controllers/keyboard.svelte.js";
    import { mouse } from "./controllers/mouse.svelte.js";
    import { getSetupAudio } from "./audio/context.js";

    interface Props {
        size?: [ number, number ];
        font?: string;
        children?: import('svelte').Snippet;
    }

    let { size = [ 1920, 1080 ], font, children }: Props = $props();

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

    const keyboardModule = keyboard();
    const timersModule = timers();
    const mouseModule = mouse();

    type FrameEvent = { type: "frame" | "before" | "after", callback: (info: { delta: number, time: number }) => any | void };
    const events = new Set<FrameEvent>();

    const context: Llama.GameContext = {
        size: () => size,
        font: () => font,
        assign,
        layer: (name) => layerAssignments.get(name) ?? null,
        timers: timersModule,
        keyboard: keyboardModule,
        mouse: mouseModule,
        on: (type: "frame" | "before" | "after", callback: (info: { delta: number, time: number }) => any | void) => {
            const event = { type, callback };
            events.add(event);
            return () => events.delete(event);
        },
        audio: () => { if (audio) return audio; throw new Error("There Is No AudioContext") },
    }

    setupGame(context);
    let last = $state(-1);

    const loop = function(time: DOMHighResTimeStamp) {
        if (last < 0) last = time;
        const delta = (time - last);

        if (delta > 1000) {
            last = time;
            return requestAnimationFrame(loop);
        }

        events.forEach(it => { if (it.type === "before") it.callback({ delta, time }) });
        timersModule.update(delta);

        events.forEach(it => { if (it.type === "frame") it.callback({ delta, time }) });
        draw();

        events.forEach(it => { if (it.type === "after") it.callback({ delta, time }) });

        last = time;
        return requestAnimationFrame(loop);
    };

    let audio: AudioContext | null = null;
    getSetupAudio((node) => {
        if (!audio) throw new Error("Audio Is Not Yet Created!")
        node.connect(audio.destination);
        return () => audio && node.disconnect(audio.destination);
    });

    onMount(() => {
        audio = new AudioContext();
        requestAnimationFrame(loop);

        const stop = [ 
            keyboardModule.start(),
            mouseModule.start(),
            timersModule.destroy 
        ];
        return () => stop.forEach(it => it());
    });

    const resumeAudioContext = () => {
        if (audio?.state === "suspended") {
            audio?.resume();
        }
    }

    let element: HTMLDivElement | undefined = $state();
    $effect(() => mouseModule.game(...size));

    const resize = () => {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const left = rect.left;
        const top = rect.top;
        const width = rect.width;
        const height = rect.height;
        mouseModule.raw({ left, top, width, height });
    }

    $effect(() => {element ? resize() : null});

</script>

<div class="game" onresize={resize} bind:this={element}>
    {@render children?.()}
</div>

<svelte:window onclick={resumeAudioContext} onresize={resize} onscroll={resize} onkeydown={resumeAudioContext}></svelte:window>

<style>
    .game {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }
</style>