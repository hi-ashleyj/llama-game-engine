import { getContext, setContext } from 'svelte';
import type { GameContext, LayerContext, DrawableContext, DrawableFunction } from "./types";

const GAME = Symbol();
const LAYER = Symbol();
const DRAWABLE = Symbol();
const BOX = Symbol();

export const setupGame = function (context: GameContext) {
    if (getContext(GAME)) {
        throw new Error("Cannot Mount Game inside a Game");
    }

    setContext(GAME, context);
};

export const setupLayer = function (context: LayerContext): ( { draw }: { draw: () => any } ) => () => any {
    if (getContext(LAYER)) {
        throw new Error("Cannot Mount Layer inside a Layer");
    }
    const game = getContext(GAME) as GameContext | undefined;
    if (!game) throw new Error("Layers must be inside a Game");
    setContext(LAYER, context);

    setupDrawable({ assign: context.assign });

    return (ctx) => {
        return game.assign(ctx);
    }
};

export const setupDrawable = function ({ assign }: Partial<DrawableContext>): ({ draw }: { draw: () => DrawableFunction }) => () => any {
    let parent = getContext(DRAWABLE) as DrawableContext | undefined;
    if (assign) {
        setContext(DRAWABLE, { assign });
    }

    return (ctx) => {
        if (!parent) return () => {};
        return parent.assign(ctx);
    }
};

export const getGame = function(): GameContext {
    return getContext(GAME);
};