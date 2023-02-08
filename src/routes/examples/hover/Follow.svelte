<script lang="ts">

    import { GameObject } from "../../../lib";
    import { Rectangle } from "../../../lib/drawables";
    import { getGame } from "../../../lib";

    let { getMouseStore } = getGame();
    const mouseX = getMouseStore("mouse_x");
    const mouseY = getMouseStore("mouse_y");

</script>

<GameObject x={$mouseX} y={$mouseY} w={50} h={50} centered={true}>
    <Rectangle fill="white" />
</GameObject>

<style lang="scss">

</style>