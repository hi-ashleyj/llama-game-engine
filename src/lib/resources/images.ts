const assets = new Map<string, HTMLImageElement>();

export const pushAsset = (url: string, element: HTMLImageElement) => {
    assets.set(url, element);
}

export const resolve = (url: string) => {
    if (assets.has(url)) {
        return assets.get(url);
    }
    const img = document.createElement("img");
    img.src = url;
    assets.set(url, img);
    return img;
}