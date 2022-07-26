import { onDestroy } from "svelte";
import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export class Timing {

    constructor() {
        this.targets = new Set();
    }
    
    targets: Set<{ current: number, duration: number, repeats: number, store: Writable<number | null> }>;
    
    /**
     * Used to create a store whose value changes based on the total delta time.
     * Duration is in MS
     * Use 0 for repeats for infinite
     */
    create({ duration, repeats }: { duration: number, repeats: number }) {
        let store = writable(0)
        let out = {
            current: 0,
            duration,
            repeats,
            store
        }

        onDestroy(() => {
            if (this.targets.has(out)) this.targets.delete(out);
        })

        this.targets.add(out);
        return store;
    }

    update(delta: number) {
        this.targets.forEach((t, ignored, set) => {
            if (t.current < 0) {
                t.store.set(null);
                set.delete(t);
                return;
            }
            
            t.current += delta;
            if (t.repeats > 0 && t.current > t.duration * t.repeats) {
                t.current = -1;
                t.store.set(1);
                return;
            }

            t.store.set((t.current / t.duration) % 1);
        })
    }

}