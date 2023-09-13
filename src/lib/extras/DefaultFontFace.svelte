<script lang="ts">

    import { getGame } from "$lib";
    import { onMount, createEventDispatcher } from "svelte";
    const { defaultTextFontFace } = getGame();

    const dispatch = createEventDispatcher();

    /**
     * THE DEFAULT FONT IS ONLY SET ON MOUNT. WRAP INSIDE A {key} IF THIS WILL CHANGE
     */
    export let font: string;

    /**
     * FONT FACES ARE ONLY AUTO-LOADED ON MOUNT.
     * WRAPPING INSIDE A {key} MAY FIX THIS (not recommended)
     * IF CHANGING FONTS, PRELOAD THEM ALL IN CSS AND UPDATE font PROP ONLY WITHIN {key} BLOCK
     */
    export let url: string | undefined;

    onMount(() => {
        defaultTextFontFace.set(font);

        if (url) {
            const face = new FontFace(font, `url(${url})`);
            face.load().then(() => dispatch("loaded"));
            document.fonts.add(face);
            return () => {
                document.fonts.delete(face);
            }
        }
    })

</script>