let list: Map<string, HTMLImageElement> = new Map();

export const resolve = function(src: string): HTMLImageElement {
    if (list.has(src)) return list.get(src) as HTMLImageElement;

    let img = document.createElement("img");
    img.src = src;
    list.set(src, img);

    return img;
};