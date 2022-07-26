import { getContext, setContext, onDestroy } from 'svelte';
import { Writable } from 'svelte/store';

const GAME = Symbol();
const LAYER = Symbol();
const DRAWABLE = Symbol();

export type GameContext = { 
    assign: (draw: Function) => () => any, 
    width: Writable<number>, 
    height: Writable<number>, 
    background: Writable<string> 
};

export const setupGame = function (context: GameContext) {
    if (getContext(GAME)) {
        throw new Error("Cannot Mount Game inside a Game");
    }

    setContext(GAME, context);
};

export type LayerContext = { 
    assign: (draw: Function) => () => any, 
    draw: () => any 
};

export const setupLayer = function (context: LayerContext) {
    if (getContext(LAYER)) {
        throw new Error("Cannot Mount Layer inside a Layer");
    }

    let game = getContext(GAME) as GameContext | undefined;

    if (!game) throw new Error("Layers must be inside a Game");

    let remove = game.assign(context.draw);

    onDestroy(() => {
        remove();
    })

    setContext(LAYER, context);

    setupDrawable({ assign: context.assign, draw: context.draw });
};

export type DrawableContext = { 
    assign: (draw: Function) => () => any, 
    draw: () => any 
}

export const setupDrawable = function ({ assign, draw }: Partial<DrawableContext>) {
    let parent = getContext(DRAWABLE) as DrawableContext | undefined;
    if (parent && draw) {
        let remove = parent.assign(draw);

        onDestroy(() => {
            remove();
        })
    }

    if (assign) {
        setContext(DRAWABLE, { assign });
    }
};