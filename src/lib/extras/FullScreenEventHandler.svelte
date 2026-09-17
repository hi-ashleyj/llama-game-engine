<script lang="ts">

    import { getGame } from "$lib/core-contexts.js";
    import { onMount } from "svelte";

    const context = getGame();
    // ONLY OBSERVED ON MOUNT. NOT REACTIVE (good practice anyway)
    interface Props {
        key?: string;
        usesShift?: boolean;
        usesCtrl?: boolean;
        usesAlt?: boolean;
        wrapper: HTMLDivElement;
    }

    let {
        key = "f",
        usesShift = true,
        usesCtrl = false,
        usesAlt = false,
        wrapper
    }: Props = $props();

    onMount(() => {
        return context.onKeyboard("down", (k) => {
            if (k !== key) return;
            if (usesShift && !context.keyboard["shift"]) return;
            if (usesCtrl && !context.keyboard["ctrl"]) return;
            if (usesAlt && !context.keyboard["alt"]) return;

            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                wrapper.requestFullscreen().catch();
            }
        });
    })

</script>