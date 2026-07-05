<script lang="ts">

    import { GameObject, MouseClickable } from "../../../lib";
    import { Rectangle } from "../../../lib/drawables";

    interface Props {
        hue?: number;
    }

    let { hue = 0 }: Props = $props();

</script>

<GameObject x={0} y={0} w={960} h={1080} >
    <Rectangle fill={`hsl(${hue * 360}, 50%, 50%`} />
</GameObject>