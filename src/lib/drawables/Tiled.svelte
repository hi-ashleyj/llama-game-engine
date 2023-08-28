<script lang="ts">

    import type { TileSet } from "../resources/tileset.js";
    import { setupDrawable, type DrawFunction } from "../drawable.js";
    import { onMount } from "svelte";

    export let shiftX: number;
    export let shiftY: number;
    export let drawSize: number;
    export let tileSet: TileSet;
    export let alias: Record<string, [ number, number ]>;
    export let map: string[];

    $: mapWidth = map[0]?.length ?? 0;
    $: mapHeight = map.length ?? 0;

    const draw: DrawFunction<{x: number, y: number, w: number, h: number}> = ({ ctx, width, height }, { x, y, w, h }) => {

        if (!map) return;
        if (!alias) return;

        // CHECK BOUNDS
        if (shiftX < w * -1) return;
        if (shiftX > mapWidth * drawSize) return;

        if (shiftY < h * - 1) return;
        if (shiftY > mapHeight * drawSize) return;

        // WE DO HAVE TO DRAW SOME TILES
        const leftMostTile = Math.max(Math.floor(shiftX / drawSize), 0);
        const leftOffset = shiftX > 0 ? (shiftX % drawSize) * -1 : shiftX * -1;
        const tilesWide = Math.min(mapWidth - leftMostTile, Math.ceil((w - leftOffset) / drawSize), mapWidth - 1);

        const topMostTile = Math.max(Math.floor(shiftY / drawSize), 0);
        const topOffset = shiftY > 0 ? (shiftY % drawSize) * -1 : shiftY * -1;
        const tilesHigh = Math.min(mapHeight - topMostTile, Math.ceil((h - topOffset) / drawSize), mapHeight - 1);

        for ( let i = 0; i < tilesWide; i ++ ) {
            for ( let j = 0; j < tilesHigh; j ++ ) {
                try {
                    const key = map[j + topMostTile][i + leftMostTile];
                    if (key === " ") continue;
                    const dealias = alias[key];
                    if (!dealias) continue;
                    ctx.drawImage(
                        tileSet.image, 
                        dealias[0] * tileSet.size, 
                        dealias[1] * tileSet.size,
                        tileSet.size, 
                        tileSet.size, 
                        i * drawSize + leftOffset, 
                        j * drawSize + topOffset, 
                        drawSize, 
                        drawSize);
                } catch (_err) {
                    console.log(i, j);
                    throw _err;
                }
                
            }
        }
    }

    const register = setupDrawable<{x: number, y: number, w: number, h: number}, null>({});

    onMount(() => {
        return register({ draw })
    })

</script>