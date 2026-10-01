<script lang="ts">

    import { onMount } from "svelte";
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