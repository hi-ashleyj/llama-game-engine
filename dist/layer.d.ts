import { GameObject } from "./game-object";
export declare class Layer {
    static list: Map<string, Layer>;
    private id;
    private readonly canvas;
    private readonly options;
    readonly width: number;
    readonly height: number;
    private targets;
    ctx: CanvasRenderingContext2D;
    constructor(id: string, options: {
        level: number;
    });
    assign(...targets: GameObject[]): this;
    remove(...targets: GameObject[]): this;
    purge(): void;
    draw(): void;
    static draw(): void;
    static purge(): void;
}
