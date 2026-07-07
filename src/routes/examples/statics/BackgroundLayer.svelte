<script lang="ts">

    import { Primitives, MouseClickable, getTriggerLayerRender } from "$lib/index.js";
    import { Rectangle } from "$lib/drawables/index.js";

    const triggerRender = getTriggerLayerRender();
    interface Props {
        hue?: number;
    }

    let { hue = 0 }: Props = $props();

</script>

<Primitives.Area x={960} y={0} w={960} h={1080} >
    <Rectangle fill={`hsl(${hue * 360}, 50%, 50%`} />
    <MouseClickable onleft={() => triggerRender() } />
</Primitives.Area>