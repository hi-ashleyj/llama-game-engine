<script lang="ts">

    import { Primitives, getGame, Drawables } from "$lib/index.js";
    let { getMouseStore } = getGame();
    const mouseX = getMouseStore("mouse_x");
    const mouseY = getMouseStore("mouse_y");

</script>

<Primitives.Area x={$mouseX} y={$mouseY} w={50} h={50} center={true}>
    <Drawables.Rectangle fill="white" />
</Primitives.Area>