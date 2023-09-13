<script lang="ts">

    import { getGame } from "$lib";
    const { defaultTextFontFace } = getGame();

    export let font = string;

    $: defaultTextFontFace.set(font);

</script>