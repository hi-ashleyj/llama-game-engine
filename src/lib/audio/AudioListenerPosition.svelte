<script lang="ts">

    export let position: [ number, number, number ] = [0, 0, 0];
    // Roll, Pitch, Yaw. All between -180 - 180. [ 0, 0, 0 ] faces directly along the X coordinate standing upright.
    // Roll rotates the viewport leftward as it goes negative.
    // Pitch looks downwards as it goes negative.
    // Yaw rotates leftwards as it goes negative (toward -Z)
    export let orientation: [ number, number, number ] = [0, 0, 0];

    $: positionX = position[0];
    $: positionY = position[1];
    $: positionZ = position[2];
    $: roll = orientation[0];
    $: pitch = orientation[1];
    $: yaw = orientation[2];

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
        const x = Math.sin(rdRoll) * Math.cos(rdPitch) * Math.cos(rdYaw) - Math.cos(rdRoll) * Math.sin(rdPitch) * Math.sin(rdYaw)
        const y = Math.cos(rdRoll) * Math.sin(rdPitch) * Math.cos(rdYaw) + Math.sin(rdRoll) * Math.cos(rdPitch) * Math.sin(rdYaw)
        const z = Math.cos(rdRoll) * Math.cos(rdPitch) * Math.sin(rdYaw) - Math.sin(rdRoll) * Math.sin(rdPitch) * Math.cos(rdYaw)
        const w = Math.cos(rdRoll) * Math.cos(rdPitch) * Math.cos(rdYaw) + Math.sin(rdRoll) * Math.sin(rdPitch) * Math.sin(rdYaw)

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

    $: quaterion = buildQuaternion(roll, pitch, yaw);
    $: forward = rotatedVector([1, 0, 0], quaterion);
    $: up = rotatedVector([0, 1, 0], quaterion);

    import { getAudioContext } from "$lib/audio/context.js";
    import { onMount } from "svelte";
    const audioContext = getAudioContext();
    let audioCTX: AudioContext | null = null;

    $: { if (audioCTX) audioCTX.listener.positionX.value = positionX }
    $: { if (audioCTX) audioCTX.listener.positionY.value = positionY }
    $: { if (audioCTX) audioCTX.listener.positionZ.value = positionZ }
    $: { if (audioCTX) audioCTX.listener.forwardX.value = forward[0] }
    $: { if (audioCTX) audioCTX.listener.forwardY.value = forward[1] }
    $: { if (audioCTX) audioCTX.listener.forwardZ.value = forward[2] }
    $: { if (audioCTX) audioCTX.listener.upX.value = up[0] }
    $: { if (audioCTX) audioCTX.listener.upY.value = up[1] }
    $: { if (audioCTX) audioCTX.listener.upZ.value = up[2] }

    onMount(() => {
        audioCTX = audioContext();
    })

</script>