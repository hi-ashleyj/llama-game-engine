import type { Writable } from 'svelte/store';
import type { Timing } from "./controllers/motions.js";
import type { Keyboard } from "./controllers/keyboard.js";
import type { Mouse } from "./controllers/mouse.js";
import { getContext, setContext } from 'svelte';
import { setupDrawable, type DrawableContext, type DrawFunction } from './drawable.js';

export type DestroyFunction = () => any;
export type RegisterFunction<T> = (run: T) => DestroyFunction;

const GAME = Symbol();

export type GameContext = { 
    assign: (ctx: LayerContext, obj: LayerDrawable) => DestroyFunction,
    width: Writable<number>, 
    height: Writable<number>, 
    background: Writable<string>,
    createTimer: Timing["createTimer"],
    createBurst: Timing["createBurst"],
    onKeyboardEvent: Keyboard["on"],
    isKeyboardPressed: Keyboard["isPressed"],
    getKeyboardStore: Keyboard["getStore"],
    onMouseEvent: Mouse["on"],
    isMousePressed: Mouse["isPressed"],
    getMousePosition: Mouse["getPosition"],
    getMouseStore: Mouse["getStore"],
    onFrame: (callback: (info: { delta: number, time: number }) => any | void) => () => any,
    onBeforeFrame: (callback: (info: { delta: number, time: number }) => any | void) => () => any,
    onAfterFrame: (callback: (info: { delta: number, time: number }) => any | void) => () => any,
    getLayerByName: (name: string) => LayerContext | null,
    defaultTextFontFace: Writable<string | null>
};

export const setupGame = function (context: GameContext) {
    if (getContext(GAME)) {
        throw new Error("Cannot Mount Game inside a Game");
    }

    setContext<GameContext>(GAME, context);
};

export const getGame = function() {
    return getContext<GameContext>(GAME);
};

const LAYER = Symbol();

export type LayerContext = Required<DrawableContext<null>> & {
    requestFrame: (...optional: any[]) => any;
};

export type LayerDrawable = {
    draw: () => any | void
    isStatic: () => boolean,
    name: string
};

export const setupLayer = function (context: LayerContext): RegisterFunction<LayerDrawable> {
    if (getContext(LAYER)) {
        throw new Error("Cannot Mount Layer inside a Layer");
    }
    const game = getContext(GAME) as GameContext | undefined;
    if (!game) throw new Error("Layers must be inside a Game");
    setContext(LAYER, context);

    setupDrawable({ assign: context.assign });

    return (obj) => {
        return game.assign(context, obj);
    }
};

export const getLayer = function() {
    let layer = getContext<LayerContext>(LAYER);
    if (!layer) throw new Error("Layer context does not exist!");
    return layer;
};

export const getTriggerLayerRender = function() {
    let layer = getLayer();
    return layer.requestFrame;
};