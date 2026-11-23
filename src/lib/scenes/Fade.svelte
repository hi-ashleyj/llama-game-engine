<script lang="ts">

    import { getGame } from "../core/game.ts";
    import { Opacity, Rectangle, Area } from "../primitive.js";
    let { t }: { t: number } = $props();

    const game = getGame();

</script>

<Area x={0} y={0} w={game.size()[0]} h={game.size()[1]}>
    <Opacity opacity={t}>
        <Rectangle fill="black" />
    </Opacity>
</Area>