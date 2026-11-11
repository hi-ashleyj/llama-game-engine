import fragment from "../core/fragment.html?raw";
import type { Plugin } from "vite";

const REPLACEMENT_KEY = /%llamagame\.placeholder%/g;

export const HTML_FRAGMENT = fragment;
export const plugin = (): Plugin => {
    return {
        name: "@hi-ashleyj/llama-vite",
        transformIndexHtml: (html) => {
            return html.replace(REPLACEMENT_KEY, fragment);
        },
        // transform: (code, id) => {
        //     if (!id.endsWith(".manifest")) return;

        // }
    }
}