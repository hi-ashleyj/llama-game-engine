import { getContext, setContext } from 'svelte';
import type { GameContext, LayerContext, DrawableContext, DrawableFunction } from "./types";

const GAME = Symbol();
const LAYER = Symbol();
const DRAWABLE = Symbol();

export const setupGame = function (context: GameContext) {
    if (getContext(GAME)) {
        throw new Error("Cannot Mount Game inside a Game");
    }

    setContext(GAME, context);
};

export const setupLayer = function (context: LayerContext): (draw: () => any) => () => any {
    if (getContext(LAYER)) {
        throw new Error("Cannot Mount Layer inside a Layer");
    }
    const game = getContext(GAME) as GameContext | undefined;
    if (!game) throw new Error("Layers must be inside a Game");
    setContext(LAYER, context);

    setupDrawable({ assign: context.assign });

    return (draw: () => any) => {
        return game.assign(draw);
    }
};

export const setupDrawable = function ({ assign }: Partial<DrawableContext>): (draw: DrawableFunction) => () => any {
    let parent = getContext(DRAWABLE) as DrawableContext | undefined;
    if (assign) {
        setContext(DRAWABLE, { assign });
    }

    return (draw: DrawableFunction) => {
        if (!parent) return () => {};
        return parent.assign(draw);
    }
};

export const getGame = function(): GameContext {
    return getContext(GAME);
};