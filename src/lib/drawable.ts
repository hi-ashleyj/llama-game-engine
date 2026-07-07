import { getContext, setContext } from "svelte";
import type { RegisterFunction } from "./core-contexts.ts";

const DRAWABLE = Symbol();

export type DrawableContext<Props> = {
    assign: RegisterFunction<DrawableObject<Props>>
}

export type DrawableModes<Props> = DrawableContext<Props> | { hasChildren: boolean }

export type DrawableObject<Options, ChildProps = null> = {
    draw: DrawFunction<Options, ChildProps>
}

export type CoreLayerOptions<ChildProps = null> = {
    width: number,
    height: number,
    ctx: CanvasRenderingContext2D,
    children: DrawableObject<ChildProps, null>[],
}

export type DrawFunction<Props, ChildProps = null> = (core: CoreLayerOptions<ChildProps>, more: Props) => void | any;

export const setupDrawable = function<Props, ChildProps>(ctx: DrawableModes<ChildProps>): RegisterFunction<DrawableObject<Props, ChildProps>> {
    let parent = getContext<Required<DrawableContext<Props>>>(DRAWABLE);

    if ("assign" in ctx) {
        setContext<DrawableContext<ChildProps>>(DRAWABLE, { assign: ctx.assign });
    } else if ("hasChildren" in ctx && ctx.hasChildren) {
        const targets = new Set<{ draw: DrawFunction<ChildProps, null> }>();

        setContext<DrawableContext<ChildProps>>(DRAWABLE, { assign: (hi) => {
            targets.add(hi)
            return () => {
                targets.delete(hi)
            }
        } });

        return (obj) => {
            if (!parent) return () => {};
            return parent.assign({
                ...obj,
                draw: (core, ...more) => obj.draw({ ...core, children: [ ...targets.values() ]} as CoreLayerOptions<ChildProps>, ...more)
            });
        }
        
    }

    return (obj) => {
        if (!parent) return () => {};
        return parent.assign(obj as DrawableObject<Props, null>);
    }
};