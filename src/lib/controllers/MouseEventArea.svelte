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

    let mouseX = context.getMouseStore("mouse_x");
    let mouseY = context.getMouseStore("mouse_y");

    export let hover = false;

    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function(_info, { x, y, w, h }) {
        tx = x;
        ty = y;
        tw = w;
        th = h;

        if ($mouseX < tx || $mouseX > tx + tw) return hover = false;
        if ($mouseY < ty || $mouseY > ty + th) return hover = false;
        hover = true;
    };

    let register = setupDrawable<{x: number, y: number, w: number, h: number}, null>({});

    onMount(() => {
        let event = context.onMouseEvent(null, MOUSE_ACTION.DOWN, ({ key }) => {
            if ($mouseX < tx || $mouseX > tx + tw) return;
            if ($mouseY < ty || $mouseY > ty + th) return;
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

<slot {hover} />