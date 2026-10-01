export { default as ResourceLoader } from "./Loader.svelte";
export { default as ResourceImage } from "./ResourceImage.svelte";
export { default as ResourcePlayback } from "./ResourcePlayback.svelte";

// IMAGES
const imageMap = new Map<string, HTMLImageElement>();

export const putImage = (url: string, element: HTMLImageElement) => {
    imageMap.set(url, element);
}

export const useImage = (url: string) => {
    if (imageMap.has(url)) {
        return imageMap.get(url)!;
    }
    const img = document.createElement("img");
    img.src = url;
    imageMap.set(url, img);
    return img;
}

export const images = <T extends { [K: string]: string }, U extends { [L: string]: [ number, number, number, number ] }>(images: T, position: U): ((asset: keyof T) => HTMLImageElement) & { position: (name: keyof U) => { x: number, y: number, w: number, h: number }, IMAGES: string[] } => {
    const pos = (asset: keyof U) => {
        const [ x, y, w, h ] = position[asset]
        return { x: x - w, y: y - h, w, h };
    }
    const IMAGES = Object.values(images);
    const lookup = (name: keyof T) => {
        return useImage(images[name]);
    }

    lookup.IMAGES = IMAGES;
    lookup.position = pos;
    return lookup;
}