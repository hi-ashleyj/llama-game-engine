<script lang="ts">

    import { getGame } from "../core-contexts.js";
    import { setupDrawable, type DrawFunction } from "../drawable.js";
    import { onMount } from "svelte";
    import { MOUSE_ACTION } from "./mouse.js";

    let tx = 0;
    let ty = 0;
    let tw = 0;
    let th = 0;

    let context = getGame();

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
        tx = x;
        ty = y;
        tw = w;
        th = h;
    };

    let register = setupDrawable<{x: number, y: number, w: number, h: number}, null>({ hasChildren: false });

    onMount(() => {
        let event = context.onMouseEvent(null, MOUSE_ACTION.DOWN, ({ key }) => {
            let x = context.getMousePosition("mouse_x");
            if (x < tx || x > tx + tw) return;
            let y = context.getMousePosition("mouse_y");
            if (y < ty || y > ty + th) return;
            onclick?.();
            switch (key) {
                case ("mouse_left"): { onleft?.(); onleftorright?.(); return; }
                case ("mouse_right"): { onright?.(); onleftorright?.(); return; }
                case ("mouse_middle"): { onmiddle?.(); }
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