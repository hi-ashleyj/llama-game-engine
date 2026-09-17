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

const button = (b: number) => {
    switch (b) {
        case (0): return "left" as const;
        case (2): return "right" as const;
        case (1): return "middle" as const;
        default: return null;
    }
}

export class Mouse {
    private events = new Set<Event>();
    state: States = $state({
        left: false,
        middle: false,
        right: false,
        x: 0,
        y: 0,
    });

    rawWidth  : number = 1920;
    rawHeight : number = 1080;
    gameWidth : number = 1920;
    gameHeight: number = 1080;

    private fire<T extends keyof Events = keyof Events>(target: T, ...data: Events[T]) {
        this.events.forEach(({ action, call }) => {
            if (target === action) call(...data);
        })
    }
    
    start() {
        window.addEventListener("pointerdown", (e: PointerEvent) => {
            e.preventDefault();
            const key = button(e.button);
            if (!key) return;
            
            this.state[key] = true;
            this.fire(key, true);
            this.fire("press", key, true);
        });

        window.addEventListener("pointerup", (e: PointerEvent) => {
            e.preventDefault();
            const key = button(e.button);
            if (!key) return;
            
            this.state[key] = false;
            this.fire(key, false);
            this.fire("press", key, false);
        });

        window.addEventListener("pointermove", (e: PointerEvent) => {
            const rawX = e.offsetX;
            const rawY = e.offsetY;

            const wider = this.rawWidth / this.rawHeight > 16 / 9;

            const scale = wider ?
                this.gameHeight / this.rawHeight :
                this.gameWidth  / this.rawWidth;
            
            const x = (this.gameWidth  - (this.rawWidth  * scale)) / 2 + (scale * rawX);
            const y = (this.gameHeight - (this.rawHeight * scale)) / 2 + (scale * rawY);

            this.state.x = x;
            this.state.y = y;

            this.fire("x", x);
            this.fire("y", y);
            this.fire("move", x, y);
        });

        window.addEventListener("wheel", (e: WheelEvent) => {
            let rawX = e.deltaX;
            let rawY = e.deltaY;

            if (Math.abs(rawX) > 0) {
                this.fire("scroll_x", rawX);
            }
            if (Math.abs(rawY) > 0) {
                this.fire("scroll_y", rawY);
            }
            if (Math.abs(rawX) + Math.abs(rawY) > 0) {
                this.fire("scroll", rawX, rawY);
            }
        });

        window.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        })
    }

    on<T extends keyof Events = keyof Events>(action: T, call: (...params: Events[T]) => void): () => void {
        const handle = { action, call } as Event<keyof Events>;

        this.events.add(handle);
        return () => { this.events.delete(handle); }
    }

    get info() {
        return this.state;
    }

    changeWindowDimensions(width: number, height: number) {
        this.rawHeight = height;
        this.rawWidth = width;
    }

    setGameSize(width: number, height: number) {
        this.gameWidth = width;
        this.gameHeight = height;
    }
}