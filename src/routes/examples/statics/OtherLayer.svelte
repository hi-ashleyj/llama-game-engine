<script lang="ts">

    import { Primitives } from "$lib/index.js";
    import { Rectangle } from "$lib/drawables/index.js";

    interface Props {
        hue?: number;
    }

    let { hue = 0 }: Props = $props();

</script>

<Primitives.Area x={0} y={0} w={960} h={1080} >
    <Rectangle fill={`hsl(${hue * 360}, 50%, 50%`} />
</Primitives.Area>