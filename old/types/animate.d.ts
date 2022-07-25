import { Drawable } from "./drawing";

export interface AnimatedDrawable extends Drawable {
    reset(): void;
}