<script lang="ts">

    // this component is stupid as audio media sources don't re-use the asset - this only preloads the asset.0
    export let url;

</script>

<audio src={url} muted preload="auto" />