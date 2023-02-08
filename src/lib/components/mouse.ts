import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export enum MOUSE_ACTION {
    DOWN = "down",
    UP = "up",
    CLICK = "click",
    MOVE = "move"
}

export class Mouse {
    constructor() {
        this.events = new Set();
        this.mouseState = new Map();
        this.mouseStores = new Map();
    }

    events: Set<{ key: string | null, action: MOUSE_ACTION, call: (e: { key: string | null, action: MOUSE_ACTION }) => any | void }>;
    mouseState: Map<string, boolean | number>;
    mouseStores: Map<string, Writable<boolean | number>>;
    innerWidth: number = 0;
    innerHeight: number = 0;
    
    start() {
        window.addEventListener("pointerdown", (e: PointerEvent) => {
            e.preventDefault();
            let eklc: string;
            switch (e.button) {
                case (0): { eklc = "mouse_left"; break; }
                case (1): { eklc = "mouse_right"; break; }
                case (2): { eklc = "mouse_middle"; break; }
                default: return;
            }

            this.mouseState.set(eklc, true);

            this.events.forEach(({ key, action, call }) => {
                if ((key === eklc || key === null) && action === MOUSE_ACTION.DOWN) call({ key: eklc, action });
            })

            if (this.mouseStores.has(eklc)) {
                this.mouseStores.get(eklc)?.set(true);
            }
        });

        window.addEventListener("pointerup", (e: PointerEvent) => {
            e.preventDefault();

            let eklc: string;
            switch (e.button) {
                case (0): { eklc = "mouse_left"; break; }
                case (1): { eklc = "mouse_right"; break; }
                case (2): { eklc = "mouse_middle"; break; }
                default: return;
            }

            this.mouseState.set(eklc, false);

            this.events.forEach(({ key, action, call }) => {
                if ((key === eklc || key === null) && action === MOUSE_ACTION.UP) call({ key: eklc, action });
            })

            if (this.mouseStores.has(eklc)) {
                this.mouseStores.get(eklc)?.set(false);
            }
        });

        window.addEventListener("pointermove", (e: PointerEvent) => {
            let rawX = e.offsetX;
            let rawY = e.offsetY;

            let adjustedX: number;
            let adjustedY: number;

            if (this.innerWidth / this.innerHeight > 16 / 9) {
                // TODO: De Hard-code this
                const scaleFactor = 1080 / this.innerHeight;
                const realCanvasSize = 1920 / scaleFactor;
                adjustedY = rawY * scaleFactor;
                adjustedX = (rawX - ((this.innerWidth - realCanvasSize) / 2)) * scaleFactor;
            } else {
                // TODO: De Hard-code this
                const scaleFactor = 1920 / this.innerWidth;
                const realCanvasSize = 1080 / scaleFactor;
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

        window.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        })
    }

    on(key: string | null, action: MOUSE_ACTION, callback: (e: { key: string | null, action: MOUSE_ACTION }) => any | void): () => any {
        let obj = { key, action, call: callback };
        this.events.add(obj);

        return () => {
            this.events.delete(obj);
        }
    }

    getStore(key: "mouse_x" | "mouse_y" | string): Writable<typeof key extends "mouse_x" | "mouse_y" ? number : boolean> {
        if (this.mouseStores.has(key)) {
            return this.mouseStores.get(key) as ReturnType<typeof this.getStore>;
        }

        let wr;
        if (key === "mouse_x" || key === "mouse_y") {
            wr = writable(this.mouseState.get(key) ?? false);
        } else {
            wr = writable(this.mouseState.get(key) ?? false);
        }

        this.mouseStores.set(key, wr);
        return wr as ReturnType<typeof this.getStore>;
    }

    isPressed(key: string): boolean {
        return this.mouseState.get(key) as boolean ?? false;
    }

    getPosition(key: "mouse_x" | "mouse_y"): number {
        return this.mouseState.get(key) as number ?? 0;
    }

    changeWindowDimensions(width: number, height: number) {
        this.innerHeight = height;
        this.innerWidth = width;
    }
}