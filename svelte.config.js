import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
 
/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter(),
        alias: {
            "@hi-ashleyj/llama": "./src/lib"
        },
    },
    compilerOptions: {
		dev: true,
	},
};
 
export default config;