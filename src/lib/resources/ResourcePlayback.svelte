<script lang="ts">

    // this component is stupid as audio media sources don't re-use the asset - this only preloads the asset.0
    interface Props {
        url: any;
    }

    let { url }: Props = $props();

</script>

<audio src={url} muted preload="auto"></audio>