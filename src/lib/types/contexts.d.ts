import { Writable } from 'svelte/store';
import { Timing } from "../components/motions";
import { Controller } from "../components/controller";
import { Mouse } from "../components/mouse";

export type GameContext = { 
    assign: (context: { draw: Function }) => () => any,
    width: Writable<number>, 
    height: Writable<number>, 
    background: Writable<string>,
    createTimer: Timing["createTimer"],
    createBurst: Timing["createBurst"],
    onKeyboardEvent: Controller["on"],
    isKeyboardPressed: Controller["isPressed"],
    getKeyboardStore: Controller["getStore"],
    onMouseEvent: Mouse["on"],
    isMousePressed: Mouse["isPressed"],
    getMouseStore: Mouse["getStore"],
    onFrame: (callback: Function) => () => any,
    onBeforeFrame: (callback: Function) => () => any,
    onAfterFrame: (callback: Function) => () => any,

};

export type LayerContext = {
    assign: (context: { draw: Function }) => () => any
};

export type DrawableFunction = ({}: { width: number, height: number, ctx: CanvasRenderingContext2D }, ...more: any[] ) => any;

export type DrawableContext = {
    assign: (context: { draw: Function }) => () => any
}