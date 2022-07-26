import { Writable } from 'svelte/store';
import { Timing } from "../components/motions";

export type GameContext = { 
    assign: (draw: Function) => () => any, 
    width: Writable<number>, 
    height: Writable<number>, 
    background: Writable<string>,
    createTimer: Timing["create"]
};

export type LayerContext = { 
    assign: (draw: Function) => () => any, 
    draw: () => any 
};

export type DrawableFunction = ({}: { width: number, height: number, ctx: CanvasRenderingContext2D }, ...more: any[] ) => any;

export type DrawableContext = { 
    assign: (draw: Function) => () => any, 
    draw: DrawableFunction
}