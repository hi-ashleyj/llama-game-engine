import { Layer } from "./layer";
import { Drawable } from "./types/drawing";
import { AnimatedDrawable } from "./types/animate";

export class Curves {
    static stamp: number = -1;
    static targets: Set<Curves> = new Set();

    static tick(stamp: number) {
        Curves.stamp = stamp;
    }

    time: number;
    steps: { [percent: number] : number };
    count: number;
    offset: number = -1;
    points: number[];

    constructor(time: number, steps: { [percent: number]: number }, count?: number) {
        this.time = time;
        this.steps = steps;
        this.count = (count) ? count : Infinity;
        this.points = Object.keys(steps).map(key => parseFloat(key)).sort((a, b) => a - b);

        Curves.targets.add(this);
    }

    value(): number | null {
        if (this.points.length < 2) return null;
        if (this.offset < 0) this.offset = Curves.stamp;
        let duration = Curves.stamp - this.offset;
        if (Math.floor(duration / this.time) >= this.count) return null;

        let factor = duration % this.time / this.time;


        for (let i = 1; i < this.points.length; i++) {
            if (this.points[i] >= factor) {
                let to = this.points[i];
                let from = this.points[i - 1];
                let percent = (factor - from) / (to - from);
                return this.steps[from] + (this.steps[to] - this.steps[from]) * percent;
            }
        }
    }

}

export class AnimationSequence implements AnimatedDrawable {
    private readonly drawables: Drawable[] = [];
    private timing: Curves;
    private readonly duration: number;

    constructor(drawables: Drawable[], duration: number) {
        this.drawables = drawables;
        this.duration = duration;
        this.reset();
    }

    reset() {
        this.timing = new Curves(this.duration, {
            0: 0,
            1: this.drawables.length
        });
    }

    draw( layer: Layer, x: number, y: number, w: number, h: number ) {
        this.drawables[this.timing.value()].draw(layer, x, y, w, h);
    }

}

export class AnimationSwitches implements AnimatedDrawable {
    private readonly drawables: { [key: string]: AnimatedDrawable };
    private use: string;
    private readonly default: string;

    constructor(drawables: { [key: string]: AnimatedDrawable }, defaultDrawable: string) {
        this.drawables = drawables;
        this.default = defaultDrawable;
        this.use = defaultDrawable;
    }

    draw( layer: Layer, x: number, y: number, w: number, h: number ) {
        this.drawables[this.use].draw(layer, x, y, w, h);
    }

    switch(key: string) {
        if (this.use === key) return;
        this.use = key;
        this.drawables[this.use].reset();
    }

    reset(useDefault: boolean = false) {
        if (useDefault) this.use = this.default;
        this.drawables[this.use].reset();
    }
}
