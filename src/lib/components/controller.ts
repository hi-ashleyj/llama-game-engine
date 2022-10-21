import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export enum CONTROLLER_ACTION {
    DOWN = "down",
    UP = "up",
    PRESS = "press"
}

export class Controller {
    constructor() {
        this.events = new Set();
        this.keyState = new Map();
    }

    events: Set<{ key: string | null, action: CONTROLLER_ACTION, call: (e: { key: string | null, action: CONTROLLER_ACTION }) => any | void }>;
    keyState: Map<string, boolean>;
    keyStores: Map<string, Writable<boolean>>;
    
    start() {
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            let eklc = e.key.toLowerCase();
            this.keyState.set(eklc, true);

            this.events.forEach(({ key, action, call }) => {
                if ((key === eklc || key === null) && action === CONTROLLER_ACTION.DOWN) call({ key, action });
            })

            if (this.keyStores.has(eklc)) {
                this.keyStores.get(eklc)?.set(true);
            }
        });

        window.addEventListener("keyup", (e: KeyboardEvent) => {
            let eklc = e.key.toLowerCase();
            this.keyState.set(eklc, false);

            this.events.forEach(({ key, action, call }) => {
                if ((key === eklc || key === null) && action === CONTROLLER_ACTION.UP) call({ key, action });
            })

            if (this.keyStores.has(eklc)) {
                this.keyStores.get(eklc)?.set(false);
            }
        });
    }

    on(key: string | null, action: CONTROLLER_ACTION, callback: (e: { key: string | null, action: CONTROLLER_ACTION }) => any | void): () => any {
        let obj = { key, action, call: callback };
        this.events.add(obj);

        return () => {
            this.events.delete(obj);
        }
    }

    getStore(key: string): Writable<boolean> {
        if (this.keyStores.has(key)) {
            return this.keyStores.get(key) as Writable<boolean>;
        }

        let wr = writable(this.keyState.get(key) || false);

        this.keyStores.set(key, wr);
        return wr;
    }

    isPressed(key: string): boolean {
        return this.keyState.get(key) || false;
    }
}