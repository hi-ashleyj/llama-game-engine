import adapter from '@sveltejs/adapter-static'
import { defaultTheme } from '@sveltepress/theme-default';
import { sveltepress } from '@sveltepress/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltepress({
		svelteKitOptions: {
			paths: {
				base: process.argv.includes('dev') ? '' : "/llama-game-engine"
			},
			adapter: adapter(),
		},
		siteConfig: {
			title: "Llama Game Engine",
			description: "Code-first game engine for HTML Canvas, built on Svelte."
		},
		llms: {
			enabled: false,
		},
		theme: defaultTheme({
			github: "https://github.com/hi-ashleyj/llama-game-engine",
			themeColor: {
				light: "#f0f0f0",
				dark: "#0e0e0e",
				gradient: { start: "#7700cc", end: "#23a923" },
				primary: "#f584c6",
				primaryDeep: "#db188a",
				hover: "#23a923",
			},
			navbar: [
				{ to: "/guide", title: "Guide" },
				{ to: "/reference", title: "Reference" },
				{ to: "/examples", title: "Examples" },
			],
			sidebar: {
				enabled: true,
				roots: [ "/guide/", "/reference/", "/examples/" ],
			},
			i18n: { heroImage: false },
		}),
	})],
	resolve: {
		alias: {
			"@hi-ashleyj/llama": "./src/lib"
		}
	}
};

export default config;
