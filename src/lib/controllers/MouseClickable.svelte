<script lang="ts">

    import { getGame } from "../core-contexts.js";
    import { setupDrawable, type DrawFunction } from "../drawable.js";
    import { onMount } from "svelte";

    const context = getGame();
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

    const register = setupDrawable<{x: number, y: number, w: number, h: number}, null>({ hasChildren: false });

    onMount(() => {
        const event = context.onMouse<"press">("press", (key, state) => {
            if (!state) return;
            const x = context.mouse.x;
            if (x < c.x || x > c.x + c.w) return;
            const y = context.mouse.y;
            if (y < c.y || y > c.y + c.h) return;
            onclick?.();
            switch (key) {
                case ("left"): { onleft?.(); onleftorright?.(); return; }
                case ("right"): { onright?.(); onleftorright?.(); return; }
                case ("middle"): { onmiddle?.(); }
            }
            onother?.();
        });
        let deregister = register({ draw });
        return () => {
            event();
            deregister();
        }
    })

</script>