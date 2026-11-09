import type { ModuleInitialiser } from "../core/game";
import { createContext } from "svelte";

type States = {
    [K: string]: boolean;
}

type Events = {
    down: [ string ],
    up: [ string ],
}

type Event<T extends keyof Events = keyof Events> = { action: T, call: (...params: Events[T]) => void };

export type Keyboard = {
    on<T extends keyof Events = keyof Events>(action: T, call: (...params: Events[T]) => void): () => void;
    readonly is: States;
}

const [ getter, setter ] = createContext<Keyboard>();

export const useKeyboard = getter;
export const keyboard: ModuleInitialiser<Keyboard> = (ctx) => {
    const state: States = {};
    const events = new Set<Event>();

    const keydown = (e: KeyboardEvent) => {
        let eklc = e.key.toLowerCase();
        state[eklc] = true;

        events.forEach(({ action, call }) => {
            if (action === "down") call(eklc);
        })
    }

    const keyup = (e: KeyboardEvent) => {
        let eklc = e.key.toLowerCase();
        state[eklc] = false;

        events.forEach(({ action, call }) => {
            if (action === "up") call(eklc);
        })
    };

    const context = {
        on<T extends keyof Events = keyof Events>(action: T, call: (...params: Events[T]) => void): () => void {
            const handle = { action, call } as Event;

            events.add(handle);
            return () => { events.delete(handle); }
        },
        get is() {
            return state;
        },
    }

    setter(context);

    return {
        fetch: getter,
        start() {
            if (!window) return () => null;
            window.addEventListener("keydown", keydown);
            window.addEventListener("keyup", keyup);

            return () => {
                window.removeEventListener("keydown", keydown);
                window.removeEventListener("keyup", keyup);
            }
        }
    }

}