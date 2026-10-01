export type TimerModule = {
    timer: Timer,
    burst: Burst,
    update: (delta: number) => void,
    destroy: () => void,
}

export type Timers = {
    timer: Timer,
    burst: Burst,
}

export type Timer = (options: { duration: number, repeats: number }) => {
    readonly value: number;
    stop: () => any | void;
};
export type Burst = (options: { duration: number, immediate: boolean }) => {
    readonly value: number;
    trigger: () => void;
    stop: () => any | void;
};

type Target = { duration: number, repeats: number, burst: boolean, now: number }
export const timers = () => {
    const targets = new Set<Target>();

    const create = ({ duration, repeats, burst, start }: { duration: number, repeats: number, burst: boolean, start: number }) => {
        let status = $state(start);
        let progress = $derived(status < 0 ? 1 : (status / duration) % 1);
        const item = {
            duration,
            repeats: duration * repeats,
            burst,
            get now() {
                return status;
            },
            set now(it: number) {
                status = it;
            }
        }

        targets.add(item);
        const trigger = burst ? { trigger: () => {status = 0} } : {};

        return {
            get value() {
                return progress
            },
            stop: () => targets.delete(item),
            ...trigger,
        }
    }

    return {
        timer: ({ duration, repeats   }: { duration: number, repeats: number    }) => create({ duration, repeats   , burst: false, start: 0 }) as ReturnType<Timer>,
        burst: ({ duration, immediate }: { duration: number, immediate: boolean }) => create({ duration, repeats: 1, burst: true,  start: immediate ? 0 : -1 }) as ReturnType<Burst>,
        update: (delta: number) => targets.forEach((it) => {
            if (it.now < 0 && !it.burst) return targets.delete(it);
            if (it.now < 0) return;
            if (it.repeats > 0 && it.now > it.repeats) {
                it.now = -1;
                return;
            }
            it.now = it.now + delta;
        }),
        destroy: () => {
            targets.clear();
        }
    } satisfies TimerModule;
}