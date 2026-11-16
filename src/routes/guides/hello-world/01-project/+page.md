---
title: Project Setup
order: 1
sidebar: true
sidebarTitle: Project Setup
collapsible: true
---

## Recommended Setup
Llama works with both Sveltekit and Vite projects, as long as you have runes available. I recommend the latest version of Svelte 5 at this time.  
If you're building a standalone project, for example building into an app with Tauri, use Vite.  
I'd recommend only building into a Sveltekit site when you have multiple pages.  
I also highly recommend using TypeScript or being very strict with JSDoc in most situations.
  
The library also comes with additional batteries for Vite via the CLI, most of which cannot be used with Sveltekit.  

**For your first project while learning the engine, use the CLI**

## Vite Project
### Via CLI
The CLI can provide an easy scaffolding solution specifically for llama projects.  
To get started, just run
```sh
npx @hi-ashleyj/llama new
```
Then follow the instructions.  
This scaffolds the project based off of Vite's `svelte-ts` template, replacing the `src` directory and getting the basic game code set up.
> The CLI uses lockfiles via `detect-package-manager` to guess your preferred package manager. If it's not correct, install dependencies manually, generating the lockfile. 

### Manually
This assumes you already have a Vite project with Svelte available.  
Install the package with
```sh
npm install @hi-ashleyj/llama
```
Assuming your file structure looks like this:
```txt
├─ src
│  ├─ Main.svelte
│  └─ main.ts
└─ index.html
```
There are a number of things you can do.  
  
Llama provides a convienent `wrap` function from `@hi-ashleyj/llama/vite`, which automatically does a large amount default styling, as well as holds the root `<Game>` object, so you can immediately start using contexts within your main component.  
```ts
import { mount } from "svelte";
import { wrap } from "@hi-ashleyj/llama/vite"; // <- Import wrapper
import Main from './Main.svelte'

const game = wrap(Main, { // <- This returns a mountable component as well
    // As well as game options
    size: [ 1920, 1080 ],
    font: "Roboto",
    modules: {} 
});

const app = mount(game, { // <- actually mount the game
  target: document.getElementById('app')!,
  props: {
    // you can also specify the props here (as per Svelte Docs)
  }
})
```
Or you will need to mount `<Game>` yourself if you choose not to use this.  
  
You should also provide placeholder content to display in the area on first paint, while waiting for the first svelte tick.
```html
<body>
    <div id="app" style="display: contents">
        <!-- Your placeholder content would go here, and would be
         automatically overridden when the game script starts, -->
    </div>
    <script type="module" src="/src/main.ts"></script>
</body>
```
To use the animation built into Llama, you may use the Vite plugin and include `%llamagame.placeholder%` within that element in your markup.  
Place the Llama plugin before the svelte plugin.

## SvelteKit
Install Llama with
```sh
npm install @hi-ashleyj/llama
```
You will not be able to use the wrappers, and will need to include your own `<Game>` components in your pages.  
I recommend including the `<Game>` in your main `+page.svelte`, and then importing a component to sit within it, so it has full access to the game context.  
`<Game>` renders placeholder content by default, which will be embedded into your app in SSR/SSG mode, and on the first svelte microtask this will be swapped out. This cannot be overridden at this time, so you will need to swap the component in via `onMount` to render your own placeholder (at which point placeholder content would skip as onMount is run immediately)  

## Standard Folders
Aligning with Sveltekit's recent change from `$lib` to `#lib`, we recommend using subpath imports in the same way.  
Currently the CLI expects `#assets` to redirect to `src/assets`. This is not a requirement, but is the current best idea I have. The CLI will set this up for you automatically, and can be retroactively added automatically with
```sh
npx @hi-ashleyj/llama standard-dirs
```
This gives you the additional batteries regarding various assets. Support for this on Sveltekit is unknown.