<script lang="ts">

    import { GameObject, MouseClickable, getTriggerLayerRender } from "../../../lib";
    import { Rectangle } from "../../../lib/drawables";

    const triggerRender = getTriggerLayerRender();
    export let hue: number = 0;

</script>

<GameObject x={960} y={0} w={960} h={1080} >
    <Rectangle fill={`hsl(${hue * 360}, 50%, 50%`} />
    <MouseClickable on:left={() => triggerRender() } />
</GameObject>