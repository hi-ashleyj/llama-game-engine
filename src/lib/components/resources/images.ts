let list: Map<string, HTMLImageElement> = new Map();

const resolve = function(src): HTMLImageElement {
    if (list.has(src)) return list.get(src) as HTMLImageElement;

    let img = new Image();
    img.src = src;
    list.set(src, img);

    return img;
};

export default { resolve };