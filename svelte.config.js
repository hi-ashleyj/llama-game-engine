import adapter from '@sveltejs/adapter-static';
import preprocess from "svelte-preprocess";
 
/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: preprocess(),
    kit: {
        adapter: adapter(),
        alias: {
            "@hi-ashleyj/llama": "./src/lib"
        }
    },
    compilerOptions: {
		dev: true,
	},
};
 
export default config;