<script lang="ts">

    import { Primitives, getGame, Drawables } from "$lib/index.js";
    let { mouse } = getGame();

</script>

<Primitives.Area x={mouse.is.x} y={mouse.is.y} w={50} h={50} center={true}>
    <Drawables.Rectangle fill="white" />
</Primitives.Area>