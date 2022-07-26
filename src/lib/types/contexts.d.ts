import { Writable } from 'svelte/store';

export type GameContext = { 
    assign: (draw: Function) => () => any, 
    width: Writable<number>, 
    height: Writable<number>, 
    background: Writable<string> 
};

export type LayerContext = { 
    assign: (draw: Function) => () => any, 
    draw: () => any 
};

export type DrawableContext = { 
    assign: (draw: Function) => () => any, 
    draw: () => any 
}