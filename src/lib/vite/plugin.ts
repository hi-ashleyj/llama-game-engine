import { HTML_FRAGMENT } from "./fragment.js";
import type { Plugin } from "vite";

const REPLACEMENT_KEY = /%llamagame\.placeholder%/g;

export const plugin = (): Plugin => {
    return {
        name: "@hi-ashleyj/llama-vite",
        transformIndexHtml: (html) => {
            return html.replace(REPLACEMENT_KEY, HTML_FRAGMENT);
        },
    }
}