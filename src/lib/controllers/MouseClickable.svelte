<script lang="ts">

    import { getGame } from "../core-contexts.js";
    import { setupDrawable, type DrawFunction } from "../drawable.js";
    import { onMount, createEventDispatcher } from "svelte";
    import { MOUSE_ACTION } from "./mouse.js";

    let tx = 0;
    let ty = 0;
    let tw = 0;
    let th = 0;

    let dispatch = createEventDispatcher();
    let context = getGame();

    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function(_info, { x, y, w, h }) {
        tx = x;
        ty = y;
        tw = w;
        th = h;
    };

    let register = setupDrawable<{x: number, y: number, w: number, h: number}, null>({});

    onMount(() => {
        let event = context.onMouseEvent(null, MOUSE_ACTION.DOWN, ({ key }) => {
            let x = context.getMousePosition("mouse_x");
            if (x < tx || x > tx + tw) return;
            let y = context.getMousePosition("mouse_y");
            if (y < ty || y > ty + th) return;
            dispatch("click");
            switch (key) {
                case ("mouse_left"): { dispatch("left"); dispatch("leftorright"); return; }
                case ("mouse_right"): { dispatch("right"); dispatch("leftorright"); return; }
                case ("mouse_middle"): { dispatch("middle"); }
            }
            dispatch("other");
        });
        let deregister = register({ draw });
        return () => {
            event();
            deregister();
        }
    })

</script>