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

