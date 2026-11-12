import type { Loader } from "./collect.svelte.ts";

export type ImageAssetList = { [K: string]: string | [ string, number, number ] | [ string, number, number, number, number ] };
export type ImagePositionList<T extends ImageAssetList> = { [K in keyof T as T[K] extends string ? never : K]: T[K] extends [ string, number, number, number, number ] ? { x: number, y: number, w: number, h: number } : { w: number, h: number } }
export type ImageInstance<T extends ImageAssetList> = ((asset: keyof T) => HTMLImageElement) & { 
    position: <X extends keyof ImagePositionList<T> = keyof ImagePositionList<T>>(name: X) => ImagePositionList<T>[X], 
    preload: (...list: (keyof T)[]) => void,
} & Loader<"image">

export type ImageInstantiate = <T extends ImageAssetList>(param: T, relative: "TL" | "BR" | "C") => ImageInstance<T>;

const offset = (relative: "TL" | "BR" | "C", gimme: "TL" | "BR" | "C") => {
    if (relative === gimme) return 0;
    const original = relative === "BR" ? 1 : relative === "C" ? 0.5 : 0;
    const tasty = gimme === "BR" ? 1 : gimme === "C" ? 0.5 : 0;
    return tasty - original;
}

export const setupImages: ImageInstantiate = (assets, relative) => {
    const preloads = new Set<string>();
    let fetch: (asset: string) => HTMLImageElement;

    //@ts-expect-error
    const lookup: ImageInstance<typeof assets> = (key: keyof typeof assets) => {
        if (!fetch) throw new Error("Not Initialised");
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

    lookup._type = "image";
    lookup._loader = (fetcher) => {
        fetch = fetcher;
        return { load: [ ...preloads ] };
    }

    return lookup;
}