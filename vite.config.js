import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		host: "0.0.0.0",
	},
	resolve: {
		alias: {
			"@hi-ashleyj/llama": "./src/lib"
		}
	}
};

export default config;
