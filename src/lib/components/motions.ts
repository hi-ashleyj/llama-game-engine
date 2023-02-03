import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export class Timing {

    constructor() {
        this.targets = new Set();
    }
    
    targets: Set<{ current: number, duration: number, repeats: number, store: Writable<number | null>, burst?: boolean }>;
    
    /**
     * Used to create a store whose value changes based on the total delta time.
     * Duration is in MS
     * Use 0 for repeats for infinite
     */
    createTimer({ duration, repeats }: { duration: number, repeats: number }) {
        let store = { ...writable(0), stop: () => this.targets.delete(out) };
        let out = {
            current: 0,
            duration,
            repeats,
            store
        }

        this.targets.add(out);
        return store;
    }

    /**
     * Used to create a store whose value adjusts based on bursts.
     * Duration is in MS
     */
    createBurst({ duration, initialTrigger }: { duration: number, initialTrigger?: boolean }) {
        let store = { ...writable(initialTrigger ? 0 : 1), stop: () => this.targets.delete(out), trigger: () => { store.set(0); out.current = 0; } };
        let out = {
            current: initialTrigger ? 0 : -1,
            duration,
            repeats: 1,
            store,
            burst: true
        }

        this.targets.add(out);
        return store;
    }

    update(delta: number) {
        this.targets.forEach((t, ignored, set) => {
            if (t.current < 0) {
                if (t.burst) return; // do not destroy stores for bursts

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