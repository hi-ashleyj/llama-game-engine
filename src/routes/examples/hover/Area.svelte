<script lang="ts">

    import { GameObject } from "../../../lib";
    import { Rectangle } from "../../../lib/drawables";
    import { getGame } from "../../../lib";
    import { onMount } from "svelte";

    let { width, height, getKeyboardStore, onFrame } = getGame();

    let x = $width / 2;
    let y = $height / 2;


    const speed = 100;
    const size = 50;

    const wPressed = getKeyboardStore("w");
    const aPressed = getKeyboardStore("a");
    const sPressed = getKeyboardStore("s");
    const dPressed = getKeyboardStore("d");

    onMount(() => {

        return onFrame(({ delta }) => {
            let xMovement = (($aPressed ? -1 : 0) + ($dPressed ? 1 : 0)) * delta * speed / 1000;
            let yMovement = (($wPressed ? -1 : 0) + ($sPressed ? 1 : 0)) * delta * speed / 1000;

            x = Math.min(Math.max(x + xMovement, 0), $width - size);
            y = Math.min(Math.max(y + yMovement, 0), $height - size);
        });
    })

</script>

<GameObject x={x} y={y} w={size} h={size} >
    <Rectangle fill="white" />
</GameObject>

<style lang="scss">

</style>