<script lang="ts">

    import { getGame } from "../core-contexts.js";
    import { setupDrawable, type DrawableObject, type DrawFunction } from "../drawable.js";
    import { onMount } from "svelte";

    const game = getGame();

    interface Props {
        name: string;
        children?: import('svelte').Snippet;
    }

    let { name, children }: Props = $props();
    const targets = new Set<DrawableObject<null>>();
    

    const draw: DrawFunction<null> = (core) => {
        targets.forEach(t => t.draw(core));
    }

    setupDrawable<null, null>({
        assign: (obj) => {
            targets.add(obj);
            return () => targets.delete(obj);
        }
    });

    onMount(() => {
        const context = game.getLayerByName(name);
        if (!context) return;

        return context.assign({ draw });
    })

</script>

{@render children?.()}