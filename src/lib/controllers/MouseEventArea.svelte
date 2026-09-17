<script lang="ts">

    import { getGame } from "../core-contexts.js";
    import { setupDrawable, type DrawFunction } from "../drawable.js";
    import { onMount } from "svelte";

    const context = getGame();
    let c = $state({ x: 0, y: 0, w: 0, h: 0 });

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
        c = { x, y, w, h };

        const mx = context.mouse.x;
        const my = context.mouse.y;

        if (mx < x || mx > x + w) return hover = false;
        if (my < y || my > y + h) return hover = false;
        hover = true;
    };

    let register = setupDrawable<{x: number, y: number, w: number, h: number}, null>({ hasChildren: false });

    onMount(() => {
        let event = context.onMouse("press", (key, state) => {
            if (!state || !hover) return;
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

{@render children?.({ hover })}