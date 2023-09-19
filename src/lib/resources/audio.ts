const audios = new Map<string, HTMLAudioElement>();

export const pushMediaAsset = (url: string, element: HTMLAudioElement) => {
    audios.set(url, element);
}

export const pushBufferAsset = (url: string) => {

}

export const resolve = (url: string) => {
    if (audios.has(url)) {
        return audios.get(url);
    }
    const img = document.createElement("img");
    img.src = url;
    audios.set(url, img);
    return img;
}