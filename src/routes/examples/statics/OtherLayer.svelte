<script lang="ts">

    import { GameObject, MouseClickable } from "../../../lib";
    import { Rectangle } from "../../../lib/drawables";

    export let hue: number = 0;

</script>

<GameObject x={0} y={0} w={960} h={1080} >
    <Rectangle fill={`hsl(${hue * 360}, 50%, 50%`} />
</GameObject>