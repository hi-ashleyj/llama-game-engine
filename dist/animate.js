(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AnimationSwitches = exports.AnimationSequence = exports.Curves = void 0;
    class Curves {
        constructor(time, steps, count) {
            this.offset = -1;
            this.time = time;
            this.steps = steps;
            this.count = (count) ? count : Infinity;
            this.points = Object.keys(steps).map(key => parseFloat(key)).sort((a, b) => a - b);
            Curves.targets.add(this);
        }
        static tick(stamp) {
            Curves.stamp = stamp;
        }
        value() {
            if (this.points.length < 2)
                return null;
            if (this.offset < 0)
                this.offset = Curves.stamp;
            let duration = Curves.stamp - this.offset;
            if (Math.floor(duration / this.time) >= this.count)
                return null;
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
    exports.Curves = Curves;
    Curves.stamp = -1;
    Curves.targets = new Set();
    class AnimationSequence {
        constructor(drawables, duration) {
            this.drawables = [];
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
        draw(layer, x, y, w, h) {
            this.drawables[this.timing.value()].draw(layer, x, y, w, h);
        }
    }
    exports.AnimationSequence = AnimationSequence;
    class AnimationSwitches {
        constructor(drawables, defaultDrawable) {
            this.drawables = drawables;
            this.default = defaultDrawable;
            this.use = defaultDrawable;
        }
        draw(layer, x, y, w, h) {
            this.drawables[this.use].draw(layer, x, y, w, h);
        }
        switch(key) {
            if (this.use === key)
                return;
            this.use = key;
            this.drawables[this.use].reset();
        }
        reset(useDefault = false) {
            if (useDefault)
                this.use = this.default;
            this.drawables[this.use].reset();
        }
    }
    exports.AnimationSwitches = AnimationSwitches;
});
//# sourceMappingURL=animate.js.map