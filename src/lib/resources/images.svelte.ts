import { SvelteSet } from 'svelte/reactivity';

export type ImageAssetList = { [K: string]: string | [ string, number, number ] | [ string, number, number, number, number ] };
export type ImagePositionList<T extends ImageAssetList> = { [K in keyof T as T[K] extends string ? never : K]: T[K] extends [ string, number, number, number, number ] ? { x: number, y: number, w: number, h: number } : { w: number, h: number } }
export type ImageInstance<T extends ImageAssetList> = ((asset: keyof T) => HTMLImageElement) & { 
    position: <X extends keyof ImagePositionList<T> = keyof ImagePositionList<T>>(name: X) => ImagePositionList<T>[X], 
    preload: (...list: (keyof T)[]) => void 
}

export type ImageResources = {
    register: <T extends ImageAssetList>(param: T, relative: "TL" | "BR" | "C") => ImageInstance<T>;
    fetch: (url: string) => HTMLImageElement;
    _loader: () => {
        readonly preloads: string[];
        readonly loaded: number;
        push: (url: string, element: HTMLImageElement | null) => void;
        tag: (url: string) => void;
    };
};

const offset = (relative: "TL" | "BR" | "C", gimme: "TL" | "BR" | "C") => {
    if (relative === gimme) return 0;
    const original = relative === "BR" ? 1 : relative === "C" ? 0.5 : 0;
    const tasty = gimme === "BR" ? 1 : gimme === "C" ? 0.5 : 0;
    return tasty - original;
}

export const setupImages = (): ImageResources => {
    const list = new Map<string, HTMLImageElement>();
    const preloads = new SvelteSet<string>();
    const loaded = new SvelteSet<string>();

    const fetch = (url: string) => {
        if (list.has(url)) {
            if (!loaded.has(url)) console.warn(preloads.has(url) ? `Image asset "${url}" was preloaded, but still used before sync completed` : `Image asset "${url}" was used before it was loaded`);
            return list.get(url)!;
        }
        if (!loaded.has(url)) console.warn(preloads.has(url) ? `Image asset "${url}" is preloaded, but was still somehow loaded before even preload began.` : `Image asset "${url}" was loaded ad-hoc`);
        const img = document.createElement("img");
        img.src = url;
        list.set(url, img);
        return img;
    }

    return {
        register: <T extends ImageAssetList>(assets: T, relative: "TL" | "BR" | "C" = "TL"): ImageInstance<T> => {
            //@ts-expect-error
            const lookup: ImageInstance<T> = (key: keyof T) => {
                const info = assets[key];
                if (typeof info === "string") return fetch(info);
                const [ str ] = info;
                return fetch(str);
            }

            //@ts-ignore trust me bro
            lookup.position = (name, gimme: "TL" | "BR" | "C" = "TL") => {
                const info = assets[name];
                if (typeof info === "string") throw new Error("That image does not have position information");
                const [ _, v1, v2, w, h ] = info;
                if (w === undefined || h === undefined) return { w: v1, h: v2 };
                const mult = offset(relative, gimme);
                return {
                    x: v1 + (mult * w),
                    y: v2 + (mult * h),
                    w,
                    h
                };
            }

            lookup.preload = (...list) => {
                for (let image of list) {
                    const info = assets[image];
                    const url = (typeof info === "string") ? info : info[0];
                    preloads.add(url);
                }
            }
            
            return lookup;
        },
        fetch,
        _loader: () => ({
            get preloads() { return $derived([ ...preloads.values() ]) },
            get loaded() { return $derived(loaded.size) },
            push: (url, element) => {
                if (element === null) { list.delete(url); return; }
                if (list.has(url)) console.error(`Preload attempted to load in ${url}, but it was already found. What?`);
                list.set(url, element);
            },
            tag: (url) => {
                loaded.add(url);
            }
        })
    }
}

export const resources = () => {
    return {
        image: setupImages,
    }
}