import { getContext, setContext } from 'svelte';
import { getGame } from "../core-contexts.js";

export type DisconnectFunction = () => any;

const CONNECTOR = Symbol();

export type AudioSvelteContext = {
    connect: (node: AudioNode) => any
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
    return getGame().getAudioContext;
}

export const getConnector = (connect?: (node: AudioNode) => DisconnectFunction) => {
    const ctx = getContext<AudioSvelteContext>(CONNECTOR);
    if (connect) {
        setContext<AudioSvelteContext>(CONNECTOR, { connect });
    }
    return ctx.connect;
}