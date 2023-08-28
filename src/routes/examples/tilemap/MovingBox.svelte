<script lang="ts">

    import { GameObject, Drawables, getGame, useTileSet, resolveImage, type TileSet } from "$lib/index.js";
    import { onMount, type ComponentProps } from "svelte";
    import imageURI from "./panicface.png";

    let { width, height, getKeyboardStore, onFrame } = getGame();

    let x = 0;
    let y = 0;

    const speed = 250;
    const size = 50;

    const wPressed = getKeyboardStore("w");
    const aPressed = getKeyboardStore("a");
    const sPressed = getKeyboardStore("s");
    const dPressed = getKeyboardStore("d");

    let image;
    let tiles: TileSet;

    const tileAlias: ComponentProps<Drawables.Tiled>["alias"] = {
        "k": [0, 0]
    }

    const map = [
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "                                                 ",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "                                                 ",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "                                                 ",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "                                                 ",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "                                                 ",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "                                                 ",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "                                                 ",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "                                                 ",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "                                                 ",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
        "                                                 ",
        "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
    ]

    onMount(() => {

        image = resolveImage(imageURI);
        tiles = useTileSet(image, 1, 1, 16);

        return onFrame(({ delta }) => {
            let xMovement = (($aPressed ? -1 : 0) + ($dPressed ? 1 : 0)) * delta * speed / 1000;
            let yMovement = (($wPressed ? -1 : 0) + ($sPressed ? 1 : 0)) * delta * speed / 1000;

            x = Math.min(Math.max(x + xMovement, -100), $width - size);
            y = Math.min(Math.max(y + yMovement, -100), $height - size);
        });
    })

</script>

<GameObject x={0} y={0} w={1920} h={1080} >
    <Drawables.Tiled shiftX={x} shiftY={y} drawSize={48} tileSet={tiles} alias={tileAlias} map={map} />
</GameObject>