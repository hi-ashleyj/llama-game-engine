const encodedBinaryBuffers = new Map<string, ArrayBuffer>();
const decodedBuffers = new Map<string, AudioBuffer>();

let instantDecode: AudioContext | null = null;

export const pushBufferAsset = (url: string) => {
    fetch(url).then(response => {
        return response.arrayBuffer();
    }).then(buffer => {
        encodedBinaryBuffers.set(url, buffer);
        if (instantDecode) {
            instantDecode.decodeAudioData(buffer).then(audio => {
                decodedBuffers.set(url, audio);
            })
        } // otherwise there's no audioContext
    });
}

export const decodeAllBuffers = (context: AudioContext) => {
    instantDecode = context;
    for (let [url, binary] of encodedBinaryBuffers.entries()) {
        instantDecode.decodeAudioData(binary).then(audio => {
            decodedBuffers.set(url, audio);
        })
    }
}

export const resolveBuffer = async (url: string) => {
    if (decodedBuffers.has(url)) return decodedBuffers.get(url);
    if (encodedBinaryBuffers.has(url)) {
        if (instantDecode) {
            const audio = await instantDecode.decodeAudioData(encodedBinaryBuffers.get(url)!);
            decodedBuffers.set(url, audio);
            return audio;
        }
    }
}