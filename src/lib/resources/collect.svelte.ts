import { SvelteSet, SvelteMap } from 'svelte/reactivity';

export type AssetTypes = {
    image: HTMLImageElement,
    audio: HTMLAudioElement
};

export const ASSET_TYPES = {
    image: "image",
    audio: "audio"
} as const satisfies { [K in keyof AssetTypes]: K };

export type Loader<T extends keyof AssetTypes = keyof AssetTypes> = { _loader: (fetch: (url: string) => AssetTypes[T]) => { load: string[] }, _type: T };
export type Collect = <T extends { [K in string]: Loader }> (assets: T) => <K extends keyof T>(list: K) => T[K];

export const collect: Collect = (assets) => {
    const list = new Map<string, AssetTypes[keyof AssetTypes]>();
    const preloads = new SvelteMap<string, keyof AssetTypes>();
    const loaded = new SvelteSet<string>();

    const fetch = <T extends keyof AssetTypes = keyof AssetTypes>(type: T, url: string): AssetTypes[T] => {
        if (list.has(url)) {
            if (!loaded.has(url)) console.warn(preloads.has(url) ? `Asset "${url}" was preloaded, but still used before sync completed` : `Asset "${url}" was used before it was loaded`);
            return list.get(url)! as AssetTypes[T];
        }
        if (!loaded.has(url)) console.warn(preloads.has(url) ? `Asset "${url}" is preloaded, but was still somehow loaded before even preload began.` : `Asset "${url}" was loaded ad-hoc`);
        switch (type) {
            case "image": {
                const img = document.createElement("img");
                img.src = url;
                list.set(url, img);
                return img as AssetTypes[T];
            }
            case "audio": {
                const audio = document.createElement("audio");
                audio.src = url;
                audio.muted = true;
                audio.preload = "auto";
                list.set(url, audio);
                return audio as AssetTypes[T];
            }
        }
    }

    const answers = Object.values(assets).map(it => ({ ...it._loader((url) => fetch(it._type, url)), type: it._type } ));
    answers.forEach(v => {
        v.load.forEach(it => preloads.set(it, v.type));
    })

    return (req) => {
        return assets[req];
    }
}