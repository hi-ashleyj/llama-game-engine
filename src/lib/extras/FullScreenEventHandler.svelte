<script lang="ts">

    import { getGame } from "$lib/core-contexts.js";
    import { onMount } from "svelte";
    import { KEYBOARD_ACTION } from "../controllers/keyboard.js";

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
        return context.onKeyboardEvent(key, KEYBOARD_ACTION.DOWN, () => {
            if (usesShift && !context.isKeyboardPressed("shift")) return;
            if (usesCtrl && !context.isKeyboardPressed("ctrl")) return;
            if (usesAlt && !context.isKeyboardPressed("alt")) return;

            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                wrapper.requestFullscreen().catch();
            }
        });
    })

</script>