type States = {
    [K: string]: boolean;
}

type Events = {
    down: [ string ],
    up: [ string ],
}

type Event<T extends keyof Events = keyof Events> = { action: T, call: (...params: Events[T]) => void };

export class Keyboard {
    private state: States = {};
    events = new Set<Event>();
    
    start() {
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            let eklc = e.key.toLowerCase();
            this.state[eklc] = true;

            this.events.forEach(({ action, call }) => {
                if (action === "down") call(eklc);
            })
        });

        window.addEventListener("keyup", (e: KeyboardEvent) => {
            let eklc = e.key.toLowerCase();
            this.state[eklc] = false;

            this.events.forEach(({ action, call }) => {
                if (action === "up") call(eklc);
            })
        });
    }

    on<T extends keyof Events = keyof Events>(action: T, call: (...params: Events[T]) => void): () => void {
        const handle = { action, call } as Event;

        this.events.add(handle);
        return () => { this.events.delete(handle); }
    }

    get info() {
        return this.state;
    }
}