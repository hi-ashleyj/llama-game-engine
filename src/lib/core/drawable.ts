import { createContext } from "svelte";
const [ getter, setter ] = createContext<DrawableAssign<any>>();

export type CanvasManual = {
    width: number,
    height: number,
    ctx: CanvasRenderingContext2D,
};
export type CanvasAuto<Child extends any> = CanvasManual & ({ children: (props: Child) => void });

export type DrawFunction<Props       > = (canvas: CanvasManual     , props: Props) => void;
export type DrawChildren<Props, Child> = (canvas: CanvasAuto<Child>, props: Props) => void;

export type DrawableAssign<Props> = (run: DrawFunction<Props>) => () => void;

export function useDrawable<Props, Child>(                                  ): ((run: DrawFunction<Props>) => () => void);
export function useDrawable<Props, Child>(ctx:                          true): ((run: DrawChildren<Props, Child>) => () => void);
export function useDrawable<Props, Child>(ctx:         DrawableAssign<Child>): ((run: DrawFunction<Props>) => () => void);
export function useDrawable<Props, Child>(ctx?: DrawableAssign<Child> | true): ((run: DrawChildren<Props, Child> | DrawFunction<Props>) => () => void) {
    const parent = getter();

    if (ctx && typeof ctx === "function") {
        setter(ctx);
        //@ts-ignore this is gonna make me cry, but it's correct, but typescript doesn't believe me. typescript, please, i love you, please i'm begging you this is correctly typed
        return (fn) => parent(fn);
    } else if (!ctx) {
        //@ts-ignore this is gonna make me cry, but it's correct, but typescript doesn't believe me. typescript, please, i love you, please i'm begging you this is correctly typed
        return (fn) => parent(fn);
    }

    const targets = new Set<DrawFunction<Child>>();

    setter((hi) => {
        targets.add(hi);
        return () => targets.delete(hi);
    });

    return (fn) => {
        return parent((core, ...more) => { 
            return fn({
                children: (props: Child) => {
                    targets.forEach(it => it(core, props));
                },
                ...core,
            }, ...more)
        })
    };
};


export function setupDrawable(assign: DrawableAssign<null>) {
    if (assign && typeof assign === "function") {
        setter(assign);
    }
};