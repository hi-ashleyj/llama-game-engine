import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export enum MOUSE_ACTION {
    DOWN = "down",
    UP = "up",
    MOVE = "move",
    // CLICK = "click",
}

type MouseEventBoolean = "mouse_left" | "mouse_middle" | "mouse_right";
type MouseEventNumber = "mouse_x" | "mouse_y" | "mouse_scroll_y" | "mouse_scroll_x";

export class Mouse {
    constructor() {
        this.events = new Set();
        this.mouseState = new Map();
        this.mouseStores = new Map();
    }

    events: Set<{ key: string | null, action: MOUSE_ACTION, call: (e: { key: string | null, action: MOUSE_ACTION }) => any | void }>;
    mouseState: Map<MouseEventBoolean | MouseEventNumber, boolean | number>;
    mouseStores: Map<MouseEventBoolean | MouseEventNumber, Writable<boolean | number>>;
    innerWidth: number = 0;
    innerHeight: number = 0;
    drawWidth: number = 1920;
    drawHeight: number = 1080;
    
    start() {
        window.addEventListener("pointerdown", (e: PointerEvent) => {
            e.preventDefault();
            let eKeyLowCase: MouseEventBoolean;
            switch (e.button) {
                case (0): { eKeyLowCase = "mouse_left"; break; }
                case (2): { eKeyLowCase = "mouse_right"; break; }
                case (1): { eKeyLowCase = "mouse_middle"; break; }
                default: return;
            }

            this.mouseState.set(eKeyLowCase, true);

            this.events.forEach(({ key, action, call }) => {
                if ((key === eKeyLowCase || key === null) && action === MOUSE_ACTION.DOWN) call({ key: eKeyLowCase, action });
            })

            if (this.mouseStores.has(eKeyLowCase)) {
                this.mouseStores.get(eKeyLowCase)?.set(true);
            }
        });

        window.addEventListener("pointerup", (e: PointerEvent) => {
            e.preventDefault();

            let eKeyLowCase: MouseEventBoolean;
            switch (e.button) {
                case (0): { eKeyLowCase = "mouse_left"; break; }
                case (1): { eKeyLowCase = "mouse_right"; break; }
                case (2): { eKeyLowCase = "mouse_middle"; break; }
                default: return;
            }

            this.mouseState.set(eKeyLowCase, false);

            this.events.forEach(({ key, action, call }) => {
                if ((key === eKeyLowCase || key === null) && action === MOUSE_ACTION.UP) call({ key: eKeyLowCase, action });
            })

            if (this.mouseStores.has(eKeyLowCase)) {
                this.mouseStores.get(eKeyLowCase)?.set(false);
            }
        });

        window.addEventListener("pointermove", (e: PointerEvent) => {
            let rawX = e.offsetX;
            let rawY = e.offsetY;

            let adjustedX: number;
            let adjustedY: number;

            if (this.innerWidth / this.innerHeight > 16 / 9) {
                // TODO: De Hard-code this
                const scaleFactor = this.drawHeight / this.innerHeight;
                const realCanvasSize = this.drawWidth / scaleFactor;
                adjustedY = rawY * scaleFactor;
                adjustedX = (rawX - ((this.innerWidth - realCanvasSize) / 2)) * scaleFactor;
            } else {
                // TODO: De Hard-code this
                const scaleFactor = this.drawWidth / this.innerWidth;
                const realCanvasSize = this.drawHeight / scaleFactor;
                adjustedX = rawX * scaleFactor;
                adjustedY = (rawY - ((this.innerHeight - realCanvasSize) / 2)) * scaleFactor;
            }

            this.mouseState.set("mouse_x", adjustedX);
            this.mouseState.set("mouse_y", adjustedY);

            this.events.forEach(({ key, action, call }) => {
                if ((key === "mouse_x" || key === null) && action === MOUSE_ACTION.MOVE) call({ key: "mouse_x", action });
                if ((key === "mouse_y" || key === null) && action === MOUSE_ACTION.MOVE) call({ key: "mouse_y", action });
            })

            if (this.mouseStores.has("mouse_x")) {
                this.mouseStores.get("mouse_x")?.set(adjustedX);
            }
            if (this.mouseStores.has("mouse_y")) {
                this.mouseStores.get("mouse_y")?.set(adjustedY);
            }
        });

        window.addEventListener("wheel", (e: WheelEvent) => {
            let rawX = e.deltaX;
            let rawY = e.deltaY;

            this.events.forEach(({ key, action, call }) => {
                if ((key === "mouse_scroll_x" || key === null) && action === MOUSE_ACTION.MOVE && Math.abs(rawX) > 0) call({ key: "mouse_scroll_x", action });
                if ((key === "mouse_scroll_y" || key === null) && action === MOUSE_ACTION.MOVE && Math.abs(rawY) > 0) call({ key: "mouse_scroll_y", action });
            })
        });

        window.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        })
    }

    on(key: MouseEventBoolean | MouseEventNumber | null, action: MOUSE_ACTION, callback: (e: { key: string | null, action: MOUSE_ACTION }) => any | void): () => any {
        let obj = { key, action, call: callback };
        this.events.add(obj);

        return () => {
            this.events.delete(obj);
        }
    }

    getStore<T extends (MouseEventBoolean | MouseEventNumber)>(key: T): Writable<T extends MouseEventNumber ? number : boolean> {
        if (this.mouseStores.has(key)) {
            return this.mouseStores.get(key) as Writable<T extends MouseEventNumber ? number : boolean>;
        }

        if (key === "mouse_x" || key === "mouse_y" || key === "mouse_scroll_x" || key === "mouse_scroll_y") {
            let wr = writable((this.mouseState.get(key) as number | undefined) ?? 0);
            this.mouseStores.set(key, wr);
            return wr as Writable<T extends MouseEventNumber ? number : never>;
        }


        let wr = writable((this.mouseState.get(key) as boolean | undefined) ?? false);
        this.mouseStores.set(key, wr);
        return wr as Writable<T extends MouseEventNumber ? never : boolean>;

    }

    isPressed(key: MouseEventBoolean): boolean {
        return this.mouseState.get(key) as boolean ?? false;

    }

    getPosition(key: MouseEventNumber): number {
        return this.mouseState.get(key) as number ?? 0;
    }

    changeWindowDimensions(width: number, height: number) {
        this.innerHeight = height;
        this.innerWidth = width;
    }

    setWidth(width: number) {
        this.drawWidth = width;
    }

    setHeight(height: number) {
        this.drawHeight = height;
    }
}