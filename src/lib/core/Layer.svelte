<script lang="ts">

    import { type DrawFunction, setupDrawable } from "./drawable.js";
    import { useCanvas, type LayerUpdater } from "./layer.js";
    import { onMount } from "svelte";

    interface Props {
        z?: number;
        name: string;
        children?: import('svelte').Snippet;
    }
    let { z = 0, name, children }: Props = $props();

    let targets = new Set<DrawFunction<null>>();
    const { registerLayer } = useCanvas();

    let updater: LayerUpdater = $state(() => null);
    $effect(() => {if (z !== undefined) { updater({ z: z })}});
    $effect(() => {if (name !== undefined) { updater({ name: name })}});

    setupDrawable((fn) => {
        targets.add(fn);
        return () => targets.delete(fn);
    })

    onMount(() => {
        const { update, destroy } = registerLayer((core) => {
            targets.forEach(it => it(core, null));
        });
        updater = update;
        return destroy;
    })

</script>

{@render children?.()}
