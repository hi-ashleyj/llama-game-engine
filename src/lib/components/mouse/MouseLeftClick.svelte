<script lang="ts">

    import { setupDrawable, getGame } from "$lib/setup.js";
    import type { DrawableFunction } from "$lib/types/contexts";
    import { onMount, createEventDispatcher } from "svelte";
    import { MOUSE_ACTION } from "../mouse.js";

    let tx = 0;
    let ty = 0;
    let tw = 0;
    let th = 0;
    
    let dispatch = createEventDispatcher();
    let context = getGame();
    
    const draw: DrawableFunction = function(_info, { x, y, w, h }: { x: number, y: number, w: number, h: number }) {
        tx = x;
        ty = y;
        tw = w;
        th = h;
    };
    
    let register = setupDrawable({});

    onMount(() => {
        let event = context.onMouseEvent("mouse_left", MOUSE_ACTION.DOWN, () => {
            let x = context.getMousePosition("mouse_x");
            if (x < tx || x > tx + tw) return;
            let y = context.getMousePosition("mouse_y");
            if (y < ty || y > ty + th) return;
            dispatch("click");
        });
        let deregister = register({ draw });
        return () => {
            event();
            deregister();
        }
    })

</script>