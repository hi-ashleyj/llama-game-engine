<script lang="ts">

    import { getGame } from "../core-contexts";
    import { setupDrawable, type DrawableObject, type DrawFunction } from "../drawable";
    import { onMount } from "svelte";

    const game = getGame();

    export let name: string;
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

<slot />