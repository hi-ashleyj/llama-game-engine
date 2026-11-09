import type { ModuleInitialiser } from "../core/game";
import { createContext } from 'svelte';

const raise = (str: string) => { throw new Error(str) };

export type Audio = {
    destination: () => AudioDestinationNode | undefined;
    ctx: () => AudioContext | undefined;
};

export type AudioCable = {
    connect: (node: AudioNode) => () => void;
    context: () => AudioContext;
}

const [ getter, setter ] = createContext<Audio>();
const [ getCable, setCable ] = createContext<AudioCable>();

export const useAudioCable = (connect?: (node: AudioNode) => () => void): { connect: ((node: AudioNode) => () => void), context: (() => AudioContext) } => {
    const ctx = getCable();
    let waiting = true;
    let delayed = new Map<Symbol, AudioNode | (() => void)>();
    
    if (connect) {
        setCable({
            connect: (next: AudioNode) => {
                if (!waiting) return connect(next)
                const key = Symbol();
                delayed.set(key, next);
                return () => {
                    const d = delayed.get(key);
                    if (d && typeof d === "function") d();
                    delayed.delete(key);
                }
            },
            context: ctx.context,
        })
    }

    return {
        connect: (self) => {
            waiting = false;
            for (let [ k, next ] of delayed.entries()) {
                if (typeof next === "function") continue;
                if (connect) delayed.set(k, connect(next)); 
            }
            return ctx.connect(self);
        },
        context: () => ctx.context(),
    }
}

export const useAudio = getter;
export const audio: ModuleInitialiser<Audio> = (ctx) => {
    let audioCtx: AudioContext | undefined = undefined;
    let waiting = true;
    let children = new Map<Symbol, AudioNode>();

    const context = {
        ctx: () => audioCtx,
        destination: () => audioCtx?.destination,
    } satisfies Audio;

    setter(context);
    setCable({
        connect: (next: AudioNode) => {
            const key = Symbol();
            children.set(key, next);
            if (!waiting && audioCtx) next.connect(audioCtx.destination);
            return () => { if (audioCtx) { next.disconnect(audioCtx.destination) } children.delete(key) };
        },
        context: () => audioCtx ?? raise("get noded")
    });

    const resume = () => {
        if (!audioCtx) return;
        if (audioCtx.state !== "suspended") return;
        audioCtx.resume();
    }

    return {
        fetch: getter,
        start: () => {
            audioCtx = new AudioContext();
            children.forEach((value) => value.connect(audioCtx!.destination));
            window.addEventListener("click", resume);
            window.addEventListener("keydown", resume);
            return () => {
                window.removeEventListener("click", resume);
                window.removeEventListener("keydown", resume);
            }
        },
    }
}