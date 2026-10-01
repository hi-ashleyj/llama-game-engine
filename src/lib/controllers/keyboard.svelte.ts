type States = {
    [K: string]: boolean;
}

type Events = {
    down: [ string ],
    up: [ string ],
}

type Event<T extends keyof Events = keyof Events> = { action: T, call: (...params: Events[T]) => void };

export type KeyboardModule = {
    start(): () => void;
    on<T extends keyof Events = keyof Events>(action: T, call: (...params: Events[T]) => void): () => void;
    readonly is: States;
}

export type Keyboard = {
    on: KeyboardModule["on"],
    is: KeyboardModule["is"],
}

export const keyboard = (): KeyboardModule => {
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

    return {
        on<T extends keyof Events = keyof Events>(action: T, call: (...params: Events[T]) => void): () => void {
            const handle = { action, call } as Event;

            events.add(handle);
            return () => { events.delete(handle); }
        },
        get is() {
            return state;
        },
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