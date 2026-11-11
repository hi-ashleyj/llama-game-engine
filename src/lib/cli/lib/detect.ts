import { detect as packageManager, type PM } from "detect-package-manager";
import { browse, exists } from "./browse.js";
import { readFile } from "node:fs/promises";

export type ImportState = "none" | "exists" | "set" | "missing" | "unexpected";
export type Detected = {
    manager: PM,
    package_json: boolean,
    vite: boolean,
    imports: {
        assets: ImportState, // none, exists = dir no import, set = both, missing = import no dir, unexpected = something fucked in import
    }
}

const viteConfigCheck = [
    "vite.config.ts",
    "vite.config.js",
    "vite.config.mjs",
    "vite.config.mts"
];

const importChecks: { [X in keyof Detected["imports"]]: string } = {
    assets: "src/assets",
}

const checkPackageImport = async (): Promise<(dir: string, key: string) => "ok" | "wonky" | "missing"> => {
    try {
        const raw = await readFile(browse("package.json"), { encoding: "utf-8" });
        const parsed = JSON.parse(raw);
        const checks = (parsed.imports ?? {}) as Record<string, string | Record<string, string>>;

        return (dir, key) => {
            const solo = `#${key}`;
            const globby = `#${key}/*`;
            let ok = true;
            if (!(solo in checks)) {
                return "missing";
            } else if (checks[solo] !== `./${dir}/index.js`) {
                ok = false;
            }

            if (!(globby in checks)) {
                return "missing";
            } else if (checks[globby] !== `./${dir}/*`) {
                ok = false;
            }
            return ok ? "ok" : "wonky";
        }

    } catch (e) {
        return () => "missing";
    }
}

const blend = (params: "ok" | "wonky" | "missing", existing: boolean): ImportState => {
    switch (params) {
        case "ok": return existing ? "set" : "missing";
        case "missing": return existing ? "exists" : "none";
        case "wonky": return existing ? "unexpected" : "none";
    }
}

export const detect = async (): Promise<Detected> => {
    const package_json = await exists(browse("package.json"));
    const vite = (await Promise.all(viteConfigCheck.map(it => exists(browse(it))))).some(it => it);
    const manager = await packageManager();

    const has = await checkPackageImport();

    return {
        package_json,
        vite,
        manager,
        imports: {
            assets: blend(has(importChecks.assets, "assets"), await exists(browse(...importChecks.assets.split("/"))))
        }
    }
}