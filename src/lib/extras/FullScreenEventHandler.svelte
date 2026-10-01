<script lang="ts">

    import { getGame } from "$lib/context.js";
    import { onMount } from "svelte";

    const { keyboard } = getGame();
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
        return keyboard.on("down", (k) => {
            if (k !== key) return;
            if (usesShift && !keyboard.is["shift"]) return;
            if (usesCtrl && !keyboard.is["ctrl"]) return;
            if (usesAlt && !keyboard.is["alt"]) return;

            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                wrapper.requestFullscreen().catch();
            }
        });
    })

</script>