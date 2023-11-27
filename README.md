# Llama - A 2D Canvas game engine built with Svelte + SvelteKit
This thing isn't ready - and probably will never be fully done. This is just as far as I've gotten.  

## Seriously, don't use this yet.

## A Good Starting point.
I'd recommend starting with a sveltekit project configured with TS. That's what I use basically 100% of the time.  
To get started:  

```html
/// +page.svelte
<script lang="ts">

    import { SensibleDefaultStyles, Game } from "@hi-ashleyj/llama";

</script>

// Auto-configure a wrapper and some global styles. Optional.
<SensibleDefaultStyles> 

    <Game>
        
    </Game>

</SensibleDefaultStyles>

<style>

    @font-face {
        // ...define fonts
    }

</style>
```

## Asset Handling
Let's prepare some asset handling. I recommend doing this in it's own component. The following pattern preloads assets with the page:  

```diff
/// +page.svelte

    import { SensibleDefaultStyles, Game } from "@hi-ashleyj/llama";
+   import Assets from "./Assets.svelte";

    ...

    <Game>

+       <Assets />

    </Game>
```
```html
/// Assets.svelte

<script lang="ts">

    import { AssetPool, ImageAsset, AudioBufferedAsset, AudioMediaAsset } from "@hi-ashleyj/llama/resources";

    // ... use standard Vite imports here 

</script>

<AssetPool>

    <ImageAsset url={...} />
    ...

</AssetPool>

```

## Layer Setup
A Llama game is made of multiple 2D Layers. I highly recommend creating a folder for all layers, then having an additional folder per layer.  
We'll create an additional layers.ts file in order to glob import the layer components, as Vite only supports globbing in TS files.  

```diff
  /src/routes
+ ├── layers
+ │   ├── background
+ │   ├── ui
+ │   └── layers.ts
  ├── +page.svelte
  └── Assets.svelte
```

```ts
// layers/layers.ts
import type { SvelteComponent } from "svelte";

const imports = import.meta.glob<{default: SvelteComponent}>("./**/_Layer.svelte", {eager: true});
export const layers: SvelteComponent[] = Object.keys(imports).map((it) => imports[it].default);
```

```diff
/// +page.svelte

    import Assets from "./Assets.svelte";
+   import { layers } from "./layers/layers.js";

    ...

    <Game>

+       {#each layers as layer}
+           <svelte:component this={layer}>
+       {/each}

    </Game>
```

## Layers and Scenes
Let's get started with actually creating some Layers now.  
You'll probably find it faster to also setup Scenes now as well.  
Let's start by making a file to store potential scenes in.  

```diff
  /src/lib
+ └── constants.ts
```

```ts
/// src/lib/constants.ts

export const SCENES = {
    // examples
    MENU: "default", // Scene "default" will be shown on load.
    GAME: "game"
    ...
} as const;
```

And now, let's create a layer, and add the scene switcher to it.

```diff
  /src/routes
  ├── layers
  │   ├── background
+ │   │   └── _Layer.svelte
  │   └── ...
  └── ...
```

```html
/// layers/background/_Layer.svelte

<script lang="ts">

    import { Layer } from "@hi-ashleyj/llama";
    import { SceneSwitcher } from "@hi-ashleyj/llama/scenes";
    import { SCENES } from "$lib/constants.js";

    // ... import individual scene components here

</script>

<Layer name="background" zIndex={0}>
    <SceneSwitcher scenes={{
        ...
    }}/>
</Layer>

```
And that's all we need to create a layer. We should also probably setup a scene.  
Here's an example for how to add the Menu and Game scenes we hinted earlier:

```diff
  /src/routes
  ├── layers
  │   ├── background
  │   │   ├── _Layer.svelte
+ │   │   ├── Game.svelte
+ │   │   └── Menu.svelte
  │   └── ...
  └── ...
```

```diff
/// layers/background/_Layer.svelte

    import { SCENES } from "$lib/constants.js";

    // ... import individual scene components here
+   import Menu from "./Menu.svelte"
+   import Game from "./Game.svelte"

    ...

    <SceneSwitcher scenes={{
+       [ SCENES.MENU ]: Menu,
+       [ SCENES.GAME ]: Game
    }}/>

```

Note that both Menu and Game are empty, as an empty .svelte file is still a valid Svelte component.

## Scene Transition / Changing Scene
One thing left to do before scenes can be changed is to consume the SceneTransition component somewhere.  
I like to do this in a layer above all others. Here's a basic fade animation as the scene changes.

```diff
  /src/routes
  ├── layers
+ │   ├── transition
+ │   │   └── _Layer.svelte
  │   └── ...
  └── ...
```

```html
/// layers/transition/_Layer.svelte

<script lang="ts">

    import { Layer } from "@hi-ashleyj/llama";
    import { SceneSwitcher } from "@hi-ashleyj/llama/scenes";
    import { Node, Area, Opacity } from "@hi-ashleyj/llama/primitives";
    import { Rectangle } from "@hi-ashleyj/llama/drawables";

</script>

<Layer name="transition" zIndex={99}>
    <SceneTransition let:normalized duration={800}>
        <Node x={0} y={0}>
            <Area w={0} h={0}>
                <Opacity opacity={normalized}>
                    <Rectangle fill="black" />
                </Opacity>
            </Area>
        </Node>
    </SceneTransition>
</Layer>
```

Note that due to the glob-based importing, this should be sucked into the project automagically.

## Primitives (@hi-ashleyj/llama/primitives)
These are the basic building blocks for displaying anything.  
Thing of these as points, and bounding boxes.  

## Empty
Component that literally does nothing. Use for wrapping multiple similar items together.

### Node
Base entry point. Wrapper around a single item in the game (think GameObject in unity or Empty in Blender).

```ts
type Props = {
    x: number;
    y: number;
}
```

### Area
Use within a `Node`. Specifies a bounding box for a drawable.  
Position of the parent is considered the top-left corner of the area.  
If `center` is true, it will consider parent position to be the center of the area.
```ts
type Props = {
    w: number;
    h: number;
    center: boolean = false;
    x?: number; // Optional offset
    y?: number; // Optional offset
}
```

### Translate
Use within a `Node`. Offsets the position of the node for all children.
```ts
type Props = {
    x: number;
    y: number;
}
```

### Inset
Use within an `Area`. Works similar to CSS `inset` prop. Use to move the bounding box of an `Area` towards the middle (use negative to extend).  
```ts
type Props = {
    top: number = 0;
    left: number = 0;
    right: number = 0;
    bottom: number = 0;
}
```

### Opacity
Adjusts the opacity for all drawn children. This is set absolutely, so nesting 0.5 with another 0.5 does not make a 0.25 opaque child.  
If opacity is 0 or less, drawing of children (including other opacity nodes) is skipped.  
Opacity will be clamped to 1.
```ts
type Props = {
    opacity: number; // Between 0 and 1.
}
```

### Rotate
Rotates the element by some number of degrees.  
Rotates around the top left corner of the element, unless `centered` is specified.
```ts
type Props = {
    centered: boolean = false;
    degrees: number;
}
```

