<script lang="ts">

    import { GameObject } from "../../../lib";
    import { Rectangle } from "../../../lib/drawables";
    import { getGame } from "../../../lib";
    import { onDestroy } from "svelte";
    import { KEYBOARD_ACTION } from "@hi-ashleyj/llama/controllers/keyboard";

    const context = getGame();

    let timing = context.createBurst({ duration: 350 });

    let unreference = context.onKeyboardEvent(" ", KEYBOARD_ACTION.DOWN, () => {
        timing.trigger();
    })

    onDestroy(() => {
        timing.stop();
        unreference();
    })

</script>

<GameObject x={480} y={270} w={(1 - $timing) * 960} h={10} >
    <Rectangle fill="white" />
</GameObject>