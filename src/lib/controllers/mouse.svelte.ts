type States = {
    "left": boolean;
    "middle": boolean;
    "right": boolean;

    "x": number;
    "y": number;
}

type Events = {
    left: [ boolean ],
    right: [ boolean ],
    middle: [ boolean ],
    press: [ "left" | "right" | "middle", boolean ],
    move: [ number, number ],
    x: [ number ],
    y: [ number ],
    scroll: [ number, number ],
    scroll_x: [ number ],
    scroll_y: [ number ],
}

type Event<T extends keyof Events = keyof Events> = { action: T, call: (...params: Events[T]) => void };

export type MouseModule = {
    raw: (width: number, height: number) => void;
    game: (width: number, height: number) => void;
    readonly is: States;
    on: <T extends keyof Events = keyof Events>(action: T, call: (...params: Events[T]) => void) => () => void;
    start: () => () => void;
}

export type Mouse = {
    on: MouseModule["on"],
    is: MouseModule["is"],
}

const button = (b: number) => {
    switch (b) {
        case (0): return "left" as const;
        case (2): return "right" as const;
        case (1): return "middle" as const;
        default: return null;
    }
}

export const mouse = () => {
    const events = new Set<Event>();
    let status: States = $state({
        left: false,
        middle: false,
        right: false,
        x: 0,
        y: 0,
    });

    let game = $state({ w: 1920, h: 1080 });
    let raw = $state({ x: 0, y: 0, w: 1920, h: 1080 });

    let wider = $derived(raw.w / raw.h > 16 / 9);
    let scale = $derived(wider ? game.h / raw.h : game.w / raw.w);

    const fire = <T extends keyof Events = keyof Events>(target: T, ...data: Events[T]) => {
        events.forEach(({ action, call }) => {
            if (target === action) call(...data);
        })
    }

    const pointerdown = (e: PointerEvent) => {
        e.preventDefault();
        const key = button(e.button);
        if (!key) return;
        
        status[key] = true;
        fire(key, true);
        fire("press", key, true);
    }

    const pointerup = (e: PointerEvent) => {
        e.preventDefault();
        const key = button(e.button);
        if (!key) return;
        
        status[key] = false;
        fire(key, false);
        fire("press", key, false);
    }
    
    const pointermove = (e: PointerEvent) => {
        const rawX = e.clientX - raw.x;
        const rawY = e.clientY - raw.y;

        const x = (game.w - (raw.w * scale)) / 2 + (scale * rawX);
        const y = (game.h - (raw.h * scale)) / 2 + (scale * rawY);

        status.x = x;
        status.y = y;

        fire("x", x);
        fire("y", y);
        fire("move", x, y);
    }

    const wheel = (e: WheelEvent) => {
        let rawX = e.deltaX;
        let rawY = e.deltaY;

        if (Math.abs(rawX) > 0) fire("scroll_x", rawX);
        if (Math.abs(rawY) > 0) fire("scroll_y", rawY);
        fire("scroll", rawX, rawY);
    }

    const contextmenu = (e: PointerEvent) => {
        e.preventDefault();
    }

    return {
        raw: (rect: { left: number, top: number, width: number, height: number }) => {
            console.log(rect);
            if (!rect) return;
            raw.x = rect.left;
            raw.y = rect.top;
            raw.w = rect.width;
            raw.h = rect.height;
        },
        game: (width: number, height: number) => {
            game.w = width; game.h = height;
        },
        get is() {
            return status;
        },
        on: <T extends keyof Events = keyof Events>(action: T, call: (...params: Events[T]) => void): () => void => {
            const handle = { action, call } as Event;
            events.add(handle);
            return () => { events.delete(handle); }
        },
        start: () => {
            if (!window) return () => null;
            window.addEventListener("pointerdown", pointerdown);
            window.addEventListener("pointerup", pointerup);
            window.addEventListener("pointermove", pointermove);
            window.addEventListener("wheel", wheel);
            window.addEventListener("contextmenu", contextmenu);
            return () => {
                window.removeEventListener("pointerdown", pointerdown);
                window.removeEventListener("pointerup", pointerup);
                window.removeEventListener("pointermove", pointermove);
                window.removeEventListener("wheel", wheel);
                window.removeEventListener("contextmenu", contextmenu);
            }
        }
    }
}