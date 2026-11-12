export type AssetTypes = {
    image: HTMLImageElement,
    audio: HTMLAudioElement
};

export const ASSET_TYPES = {
    image: "image",
    audio: "audio"
} as const satisfies { [K in keyof AssetTypes]: K };

export type Loader<T extends keyof AssetTypes = keyof AssetTypes> = { _loader: (fetch: (url: string) => AssetTypes[T]) => { load: string[] }, _type: T };
export type Collect = <T extends { [K in string]: Loader }> (assets: T) => (<K extends keyof T>(list: K) => T[K]) & { _loader: () => { [K: string]: string[] }, push: (url: string, asset: AssetTypes[keyof AssetTypes] | null) => void };

export const collect: Collect = (assets) => {
    const list = new Map<string, AssetTypes[keyof AssetTypes]>();

    const fetch = <T extends keyof AssetTypes = keyof AssetTypes>(type: T, url: string): AssetTypes[T] => {
        if (list.has(url)) {
            return list.get(url)! as AssetTypes[T];
        }
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

    return Object.assign(<T extends keyof typeof assets>(req: T) => assets[req], {
        _loader: () => {
            const answers = Object.values(assets).map(it => ({ ...it._loader((url) => fetch(it._type, url)), type: it._type } ));
            const grouped = Object.groupBy(answers, (it) => it.type);
            return Object.fromEntries(Object.entries(grouped).map(([ k, v ]) => [ k, [ ...new Set(...v.map(it => it.load).flat()) ] ]));
        },
        push: (url, asset) => {
            if (asset === null) list.delete(url);
            else list.set(url, asset);
        }
    } satisfies Pick<ReturnType<Collect>, keyof ReturnType<Collect>>);
}