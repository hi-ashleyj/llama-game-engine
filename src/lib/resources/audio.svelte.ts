import type { Loader } from "./collect.svelte.ts";

export type AudioAssetList = { [K: string]: string };
export type AudioInstance<T extends AudioAssetList> = Loader<"audio", T> & {
    preload: (...list: (keyof T)[]) => void,
}

export type AudioInstantiate = <T extends AudioAssetList>(param: T) => AudioInstance<T>;

export const setupImages: AudioInstantiate = (assets) => {
    const preloads = new Set<string>();
    let fetch: (asset: string) => string;

    const lookup = (key: keyof typeof assets) => {
        if (!fetch) throw new Error("Not Initialised");
        const info = assets[key];
        return fetch(info);
    }

    const out: AudioInstance<typeof assets> = Object.assign(lookup, {
        _type: "audio",
        _loader: (fetcher) => {
            fetch = fetcher;
            return { load: [ ...preloads ] };
        },
        preload: (...list) => {
            for (let file of list) {
                const url = assets[file];
                preloads.add(url);
            }
        }
    } satisfies Pick<AudioInstance<typeof assets>, keyof AudioInstance<typeof assets>>)

    return out;
}