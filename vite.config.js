import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		port: 3000,
		host: "0.0.0.0",
		hmr: {
			clientPort: 443
		}
	},
	resolve: {
		alias: {
			"@hi-ashleyj/llama": "./src/lib"
		}
	}
};

export default config;
