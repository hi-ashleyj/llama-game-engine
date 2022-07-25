import adapter from '@sveltejs/adapter-static';
 
/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter(),
        prerender: {
            default: true
        }
    },
    compilerOptions: {
		dev: true,
	},
	experimental: {
		inspector: true
	},
};
 
export default config;