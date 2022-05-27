export declare class Game {
    static width: number;
    static height: number;
    static timeouts: Set<{
        callback: (after: number) => void;
        delay: number;
        start?: number;
    }>;
    static last: number;
    static events: {
        type: string;
        call: Function;
    }[];
    private static root;
    private static audioDumpspace;
    private static imagesDumpspace;
    private static makeElements;
    static create(options: {
        width: number;
        height: number;
    }): void;
    static start(): void;
    static wait(callback: (after: number) => void, delay: number): void;
    static on(type: string, call: Function): void;
    static fire(type: any, data: any): void;
    static loop(time: DOMHighResTimeStamp): number;
    static pushCanvas(canvas: HTMLCanvasElement): void;
}
