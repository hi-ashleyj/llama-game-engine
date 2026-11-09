<script lang="ts">

    import { useMouse } from "./context.svelte.js";
    import { useDrawable, type DrawFunction } from "../core/drawable.js";
    import { onMount } from "svelte";

    const mouse = useMouse();
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

        const mx = mouse.is.x;
        const my = mouse.is.y;

        if (mx < x || mx > x + w) return hover = false;
        if (my < y || my > y + h) return hover = false;
        hover = true;
    };

    let register = useDrawable<{x: number, y: number, w: number, h: number}, null>();

    onMount(() => {
        let event = mouse.on("press", (key, state) => {
            if (!state || !hover) return;
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

{@render children?.({ hover })}