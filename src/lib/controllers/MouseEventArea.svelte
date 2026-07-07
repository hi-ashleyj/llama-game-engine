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

    let mouseX = context.getMouseStore("mouse_x");
    let mouseY = context.getMouseStore("mouse_y");

    type Click = () => void;
    interface Props {
        hover?: boolean;
        children?: import('svelte').Snippet<[{ hover: boolean }]>;
        onleft?: Click;
        onright?: Click;
        onleftorright?: Click;
        onclick?: Click;
        onmiddle?: Click;
        onother?: Click;
    }

    let { hover = $bindable(false), children, onleft, onright, onleftorright, onclick, onmiddle, onother }: Props = $props();

    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = function(_, { x, y, w, h }) {
        tx = x;
        ty = y;
        tw = w;
        th = h;

        if ($mouseX < tx || $mouseX > tx + tw) return hover = false;
        if ($mouseY < ty || $mouseY > ty + th) return hover = false;
        hover = true;
    };

    let register = setupDrawable<{x: number, y: number, w: number, h: number}, null>({ hasChildren: false });

    onMount(() => {
        let event = context.onMouseEvent(null, MOUSE_ACTION.DOWN, ({ key }) => {
            if ($mouseX < tx || $mouseX > tx + tw) return;
            if ($mouseY < ty || $mouseY > ty + th) return;
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

{@render children?.({ hover })}