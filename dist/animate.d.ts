import { Layer } from "./layer";
import { Drawable } from "./types/drawing";
import { AnimatedDrawable } from "./types/animate";
export declare class Curves {
    static stamp: number;
    static targets: Set<Curves>;
    static tick(stamp: number): void;
    time: number;
    steps: {
        [percent: number]: number;
    };
    count: number;
    offset: number;
    points: number[];
    constructor(time: number, steps: {
        [percent: number]: number;
    }, count?: number);
    value(): number | null;
}
export declare class AnimationSequence implements AnimatedDrawable {
    private readonly drawables;
    private timing;
    private readonly duration;
    constructor(drawables: Drawable[], duration: number);
    reset(): void;
    draw(layer: Layer, x: number, y: number, w: number, h: number): void;
}
export declare class AnimationSwitches implements AnimatedDrawable {
    private readonly drawables;
    private use;
    private readonly default;
    constructor(drawables: {
        [key: string]: AnimatedDrawable;
    }, defaultDrawable: string);
    draw(layer: Layer, x: number, y: number, w: number, h: number): void;
    switch(key: string): void;
    reset(useDefault?: boolean): void;
}
