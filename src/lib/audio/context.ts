import { getContext, setContext } from 'svelte';
import { getGame } from "../core-contexts.js";

export type DisconnectFunction = () => any;

const CONNECTOR = Symbol();

export type AudioSvelteContext = {
    connect: (node: AudioNode) => DisconnectFunction
};

export const getSetupAudio = function (connect: (node: AudioNode) => DisconnectFunction) {
    if (getContext(CONNECTOR)) {
        throw new Error("HELP ME I AM ALREADY INSIDE AN AUDIO CONTEXT");
    }

    setContext<AudioSvelteContext>(CONNECTOR, {
        connect
    });
};

export const getAudioContext = (): () => AudioContext => {
    return getGame().audio;
}

export const getConnector = (connect?: (node: AudioNode) => DisconnectFunction): AudioSvelteContext ["connect"] => {
    const ctx = getContext<AudioSvelteContext>(CONNECTOR);
    let waiting = true;
    let delayed = new Map<Symbol, AudioNode | DisconnectFunction>();
    if (connect) {
        setContext<AudioSvelteContext>(CONNECTOR, {
            connect: (node: AudioNode) => {
                if (!waiting) { return connect(node); }

                const symbol = Symbol();
                delayed.set(symbol, node);
                return () => {
                    const d = delayed.get(symbol);
                    if (d && typeof d === "function") d();
                }
            }
        });
    }
    // this function is me connecting
    return (self) => {
        waiting = false;
        for (let k of delayed.keys()) {
            const node = delayed.get(k)!;
            if (typeof node === "function") continue;
            if (connect) delayed.set(k, connect(node));
        }
        return ctx.connect(self);
    };
}