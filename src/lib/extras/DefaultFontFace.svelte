<script lang="ts">

    import { getGame } from "$lib/core-contexts.js";
    import { onMount } from "svelte";
    const { defaultTextFontFace } = getGame();

    interface Props {
        /**
     * THE DEFAULT FONT IS ONLY SET ON MOUNT. WRAP INSIDE A {key} IF THIS WILL CHANGE
     */
        font: string;
        /**
     * FONT FACES ARE ONLY AUTO-LOADED ON MOUNT.
     * WRAPPING INSIDE A {key} MAY FIX THIS (not recommended)
     * IF CHANGING FONTS, PRELOAD THEM ALL IN CSS AND UPDATE font PROP ONLY WITHIN {key} BLOCK
     */
        url?: string | null;
        onload?: () => void;
    }

    let { font, url = null, onload }: Props = $props();

    onMount(() => {
        defaultTextFontFace.set(font);

        if (url) {
            const face = new FontFace(font, `url(${url})`);
            face.load().then(() => onload?.());
            document.fonts.add(face);
            return () => {
                document.fonts.delete(face);
            }
        }
    })

</script>