<script lang="ts">

    import { Draw } from "$lib/index.js";
    import { useMouse } from "$lib/mouse";
    let mouse = useMouse();

</script>

<Draw.Area x={mouse.is.x} y={mouse.is.y} w={50} h={50} center={true}>
    <Draw.Rectangle fill="white" />
</Draw.Area>