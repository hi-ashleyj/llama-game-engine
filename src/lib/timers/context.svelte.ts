import type { ModuleInitialiser } from "../core/game.js";
import { createContext } from "svelte";

export type Timer = (options: { duration: number, repeats: number }) => {
    readonly value: number;
    start: () => () => any | void;
};
export type Burst = (options: { duration: number, immediate: boolean }) => {
    readonly value: number;
    trigger: () => void;
    start: () => () => any | void;
};
export type Once = () => {
    readonly value: number;
    start: (duration: number) => () => any | void;
};

export type Timers = {
    timer: Timer,
    burst: Burst,
    once: Once,
}

type Target = { repeats: number, burst: boolean, now: number, setty: (it: number) => void }

const [ getter, setter ] = createContext<Timers>();

export const useTimer: Timer = (...props) => getter().timer(...props);
export const useBurst: Burst = (...props) => getter().burst(...props);
export const timers: ModuleInitialiser<Timers> = (ctx) => {
    const targets = new Set<Target>();

    const create = ({ duration, repeats, burst, start }: { duration: number, repeats: number, burst: boolean, start: number }): Target => {
        let status = $state(start);
        return {
            repeats: duration * repeats,
            burst,
            get now() {
                return status;
            },
            setty: (it: number) => {
                status = it;
            }
        }
    }

    const context: Timers = {
        timer: ({ duration, repeats }) => {
            const item = create({ duration, repeats, burst: false, start: 0 });
            const value = $derived(item.now < 0 ? 1 : (item.now / duration) % 1);

            return {
                get value() {
                    return value;
                },
                start: () => {
                    targets.add(item)
                    return () => { targets.delete(item) }
                }
            }
        },
        burst: ({ duration, immediate }) =>{
            const item = create({ duration, repeats: 1, burst: true, start: immediate ? 0 : -1 });
            const value = $derived(item.now < 0 ? 1 : (item.now / duration) % 1);
            return {
                get value() {
                    return value;
                },
                start: () => {
                    targets.add(item)
                    return () =>{ targets.delete(item) }
                },
                trigger: () => { item.setty(0) } 
            }
        },
        once: () => {
            const item = create({ duration: 100, repeats: 1, burst: true, start: -1 });
            let actual = $state(0);
            const value = $derived(item.now < 0 ? 1 : (item.now / actual) % 1);
            return {
                get value() {
                    return value;
                },
                start: (duration) => {
                    item.repeats = duration;
                    actual = duration;
                    item.setty(0);
                    if (!targets.has(item)) targets.add(item);
                    return () => { targets.delete(item); }
                }
            }
        }
    }

    setter(context);

    //@ts-expect-error
    ctx.on("update", ({ delta }) => {
        targets.forEach((it) => {
            if (it.now < 0 && !it.burst) return targets.delete(it);
            if (it.now < 0) return;
            if (it.repeats > 0 && it.now > it.repeats) {
                it.now = -1;
                return;
            }
            it.setty(it.now + delta);
        })
    });

    return {
        fetch: getter,
        start: () => {
            return () => {
                targets.clear();
            }
        }
    };
}