// Roll, Pitch, Yaw. All between -180 - 180. [ 0, 0, 0 ] faces directly along the X coordinate standing upright.
// Roll rotates the viewport leftward as it goes negative.
// Pitch looks downwards as it goes negative.
// Yaw rotates leftwards as it goes negative (toward -Z)

export const dot = ([i, j, k]: number[], [x, y, z]: number[]): number => {
    return i * x + j * y + k * z;
}

export const cross = ([i, j, k]: number[], [x, y, z]: number[]) => {
    return [
        (j * z) - (k * y),
        ((i * z) - (k * x)) * -1,
        (i * y) - (j * x)
    ]
}

export const buildQuaternion = (roll: number, pitch: number, yaw: number) => {
    const rdRoll = roll / 360 * Math.PI;
    const rdPitch = pitch / 360 * Math.PI;
    const rdYaw = yaw / 360 * Math.PI;
    const x = Math.sin(rdRoll) * Math.cos(rdPitch) * Math.cos(rdYaw) - Math.cos(rdRoll) * Math.sin(rdPitch) * Math.sin(rdYaw);
    const y = Math.cos(rdRoll) * Math.sin(rdPitch) * Math.cos(rdYaw) + Math.sin(rdRoll) * Math.cos(rdPitch) * Math.sin(rdYaw);
    const z = Math.cos(rdRoll) * Math.cos(rdPitch) * Math.sin(rdYaw) - Math.sin(rdRoll) * Math.sin(rdPitch) * Math.cos(rdYaw);
    const w = Math.cos(rdRoll) * Math.cos(rdPitch) * Math.cos(rdYaw) + Math.sin(rdRoll) * Math.sin(rdPitch) * Math.sin(rdYaw);

    return [ x, y, z, w ];
}

export const rotatedVector = ([i, j, k]: number[], [x, y, z, w]: number[]) => {
    const dotUVTimesTwo = dot([x, y, z], [i, j, k]) * 2;
    const WxWMinusDotUU = w * w - dot([x, y, z], [x, y, z]);
    const crossUV = cross([x, y, z], [i, j, k]);

    return [
        dotUVTimesTwo * x + WxWMinusDotUU * i + 2 * w * crossUV[0],
        dotUVTimesTwo * y + WxWMinusDotUU * j + 2 * w * crossUV[1],
        dotUVTimesTwo * z + WxWMinusDotUU * k + 2 * w * crossUV[2],
    ]
}