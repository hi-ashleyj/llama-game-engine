---
title: Mouse Interaction
order: 4
sidebar: true
sidebarTitle: Mouse Interaction
collapsible: true
---

## Initialising `<Game>`
In Llama, `<Game>` is the core of the engine. It's responsible for setting up the event loop, and pretty much everything else.  
Under the hood, it just acts as a full-size div that acts as a relative position guide for anything underneath it, which will be useful when we start adding canvases etc.  
If you do any initialisation, you probably want to be inside this component.  
The `<Game>` takes in a couple of critical options, that you'll want to specify before continuing.  
  
```ts
interface Props {
  // Modules - REQUIRED - will be talked about later
  modules: {}; 
  
  // Svelte standard children snippet
  children?: import('svelte').Snippet; 

  // Render size as [ width = 1920, height = 1080 ]. 
  // Will render canvases at this resolution, and fit content inside its container
  size?: [ number, number ]; 

  // A default font. Unspecified will use "sans-serif"
  font?: string; 

  // Fallback content, used only in SSR contexts. This should be standard HTML code, NOT canvas code
  fallback?: import("svelte").Snippet; 
}

```
:::tip[Recommended]
We will also create `Main.svelte` for your game at this time, where all the actual game code will go. Getting set up varies between the different build environments, so pick whichever guide works for you.
:::
<Tabs activeName="Vite with Wrapper">
<TabPanel name="Vite with Wrapper">

:::note
If you set up the project via the CLI, this should already be set up for you.  
:::
  
Llama provides a wrapper out of `@hi-ashleyj/llama/vite`, which wraps your Main component in a full-viewport div and initialises `<Game>` for you inside it.  
If you've followed the previous page, you should already have the options written out.  

```ts title="src/main.ts"
const game = wrap(Main, {
    size: [ 1920, 1080 ], // [svp! hl]
    font: "Roboto", // [svp! hl]
    modules: {} // [svp! hl]
});
```

Adjust if needed, otherwise you should be set!  

</TabPanel>

<TabPanel name="Vite without Wrapper">

</TabPanel>

<TabPanel name="Sveltekit">


</TabPanel>
</Tabs>


## Modules



## Global Types


## Fallback Content