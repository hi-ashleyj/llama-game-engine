<script lang="ts">

    import { buildQuaternion, rotatedVector } from "../utils/quaternions.js";
    import { useAudioCable } from "./context.js";
    import { onMount } from "svelte";
    interface Props {
        position?: [ number, number, number ];
        orientation?: [ number, number, number ];
        cone?: [ number, number ];
        /**
         * Distance Model, Rolloff Factor, Ref Distance, Max Distance
         */
        falloff?: [ "inverse" | "linear" | "exponential", number, number, number ];
        children?: import("svelte").Snippet;
    }

    const { connect, context } = useAudioCable((node) => {
        node.connect(output!);
        return () => node.disconnect(output!);
    })

    let { position = [0, 0, 0], orientation = [0, 0, 0], cone = [ 360, 0 ], falloff = [ "inverse", 1, 1, 10000 ], children }: Props = $props();
    let output: PannerNode | undefined = $state();

    onMount(() => {
        output = context().createPanner();
        return connect(output);
    })

    let positionX = $derived(position[0]);
    let positionY = $derived(position[1]);
    let positionZ = $derived(position[2]);
    let quaterion = $derived(buildQuaternion(...orientation));
    let forward = $derived(rotatedVector([1, 0, 0], quaterion));
    $effect(() => { if (output) output.positionX.value = positionX });
    $effect(() => { if (output) output.positionY.value = positionY });
    $effect(() => { if (output) output.positionZ.value = positionZ });
    $effect(() => { if (output) output.orientationX.value = forward[0] });
    $effect(() => { if (output) output.orientationY.value = forward[1] });
    $effect(() => { if (output) output.orientationZ.value = forward[2] });
    $effect(() => { if (output) output.coneInnerAngle = cone[0] });
    $effect(() => { if (output) output.coneOuterAngle = cone[1] });
    $effect(() => { if (output) output.distanceModel = falloff[0] });
    $effect(() => { if (output) output.rolloffFactor = falloff[1] });
    $effect(() => { if (output) output.refDistance = falloff[2] });
    $effect(() => { if (output) output.maxDistance = falloff[3] });
</script>

{@render children?.()}