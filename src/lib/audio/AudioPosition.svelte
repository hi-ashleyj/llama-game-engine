<script lang="ts">

    // Roll, Pitch, Yaw. All between -180 - 180. [ 0, 0, 0 ] faces directly along the X coordinate standing upright.
    // Roll rotates the viewport leftward as it goes negative.
    // Pitch looks downwards as it goes negative.
    // Yaw rotates leftwards as it goes negative (toward -Z)

    const dot = ([i, j, k]: number[], [x, y, z]: number[]): number => {
        return i * x + j * y + k * z;
    }

    const cross = ([i, j, k]: number[], [x, y, z]: number[]) => {
        return [
            (j * z) - (k * y),
            ((i * z) - (k * x)) * -1,
            (i * y) - (j * x)
        ]
    }

    const buildQuaternion = (roll: number, pitch: number, yaw: number) => {
        const rdRoll = roll / 360 * Math.PI;
        const rdPitch = pitch / 360 * Math.PI;
        const rdYaw = yaw / 360 * Math.PI;
        const x = Math.sin(rdRoll) * Math.cos(rdPitch) * Math.cos(rdYaw) - Math.cos(rdRoll) * Math.sin(rdPitch) * Math.sin(rdYaw);
        const y = Math.cos(rdRoll) * Math.sin(rdPitch) * Math.cos(rdYaw) + Math.sin(rdRoll) * Math.cos(rdPitch) * Math.sin(rdYaw);
        const z = Math.cos(rdRoll) * Math.cos(rdPitch) * Math.sin(rdYaw) - Math.sin(rdRoll) * Math.sin(rdPitch) * Math.cos(rdYaw);
        const w = Math.cos(rdRoll) * Math.cos(rdPitch) * Math.cos(rdYaw) + Math.sin(rdRoll) * Math.sin(rdPitch) * Math.sin(rdYaw);

        return [ x, y, z, w ];
    }

    const rotatedVector = ([i, j, k]: number[], [x, y, z, w]: number[]) => {
        const dotUVTimesTwo = dot([x, y, z], [i, j, k]) * 2;
        const WxWMinusDotUU = w * w - dot([x, y, z], [x, y, z]);
        const crossUV = cross([x, y, z], [i, j, k]);

        return [
            dotUVTimesTwo * x + WxWMinusDotUU * i + 2 * w * crossUV[0],
            dotUVTimesTwo * y + WxWMinusDotUU * j + 2 * w * crossUV[1],
            dotUVTimesTwo * z + WxWMinusDotUU * k + 2 * w * crossUV[2],
        ]
    }


    import { getAudioContext, getConnector } from "$lib/audio/context.js";
    import { onMount } from "svelte";
    interface Props {
        position?: [ number, number, number ];
        orientation?: [ number, number, number ];
        cone?: [ number, number ];
        /**
         * Distance Model, Rolloff Factor, Ref Distance, Max Distance
         */
        falloff?: [ "inverse" | "linear" | "exponential", number, number, number ];
    }

    let { position = [0, 0, 0], orientation = [0, 0, 0], cone = [ 360, 0 ], falloff = [ "inverse", 1, 1, 10000 ] }: Props = $props();
    const audioContext = getAudioContext();
    let output: PannerNode | undefined = $state();

    const connect = getConnector((node) => {
        node.connect(output!);
        return () => node.disconnect(output!);
    })

    onMount(() => {
        const audioCTX = audioContext();
        output = audioCTX.createPanner();
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