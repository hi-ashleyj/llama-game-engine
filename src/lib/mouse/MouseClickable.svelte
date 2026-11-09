<script lang="ts">

    import { useDrawable, type DrawFunction } from "../core/drawable.js";
    import { useMouse } from "./context.svelte.js";
    import { onMount } from "svelte";

    const mouse = useMouse();
    let c = $state({ x: 0, y: 0, w: 0, h: 0 });

    type Click = () => void;
    type Events = Partial<{
        onleft: Click,
        onright: Click,
        onleftorright: Click,
        onclick: Click,
        onmiddle: Click,
        onother: Click,
    }>

    let { onleft, onright, onleftorright, onclick, onmiddle, onother }: Events = $props();

    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function(_, { x, y, w, h }) {
        c = { x, y, w, h };
    };

    const register = useDrawable<{x: number, y: number, w: number, h: number}, null>();

    onMount(() => {
        const event = mouse.on("press", (key, state) => {
            if (!state) return;
            const x = mouse.is.x;
            if (x < c.x || x > c.x + c.w) return;
            const y = mouse.is.y;
            if (y < c.y || y > c.y + c.h) return;
            onclick?.();
            switch (key) {
                case ("left"): { onleft?.(); onleftorright?.(); return; }
                case ("right"): { onright?.(); onleftorright?.(); return; }
                case ("middle"): { onmiddle?.(); }
            }
            onother?.();
        });
        let deregister = register(draw);
        return () => {
            event();
            deregister();
        }
    })

</script>