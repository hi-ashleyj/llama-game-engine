<script lang="ts">

    import { buildQuaternion, rotatedVector } from "../utils/quaternions.js";
    import { useAudioCable } from "./context.js";
    import { onMount } from "svelte";
    interface Props {
        position?: [ number, number, number ];
        orientation?: [ number, number, number ];
    }

    let { position = [0, 0, 0], orientation = [0, 0, 0] }: Props = $props();
    const { context } = useAudioCable();
    let audioCTX: AudioContext | null = $state(null);

    onMount(() => {
        audioCTX = context();
    })

    let positionX = $derived(position[0]);
    let positionY = $derived(position[1]);
    let positionZ = $derived(position[2]);
    let roll = $derived(orientation[0]);
    let pitch = $derived(orientation[1]);
    let yaw = $derived(orientation[2]);
    let quaterion = $derived(buildQuaternion(roll, pitch, yaw));
    let forward = $derived(rotatedVector([1, 0, 0], quaterion));
    let up = $derived(rotatedVector([0, 1, 0], quaterion));
    $effect(() => { if (audioCTX) audioCTX.listener.positionX.value = positionX });
    $effect(() => { if (audioCTX) audioCTX.listener.positionY.value = positionY });
    $effect(() => { if (audioCTX) audioCTX.listener.positionZ.value = positionZ });
    $effect(() => { if (audioCTX) audioCTX.listener.forwardX.value = forward[0] });
    $effect(() => { if (audioCTX) audioCTX.listener.forwardY.value = forward[1] });
    $effect(() => { if (audioCTX) audioCTX.listener.forwardZ.value = forward[2] });
    $effect(() => { if (audioCTX) audioCTX.listener.upX.value = up[0] });
    $effect(() => { if (audioCTX) audioCTX.listener.upY.value = up[1] });
    $effect(() => { if (audioCTX) audioCTX.listener.upZ.value = up[2] });
</script>