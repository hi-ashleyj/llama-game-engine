import { note, spinner, isCancel, select } from "@clack/prompts";
import { styleText } from "node:util";
import { detect } from "../lib/detect.js";

export const pick = async (): Promise<boolean> => {
    const spin = spinner();
    spin.start("Detecting your environment...");
    const detection = await detect();
    spin.stop(styleText("dim", "Ready"));

    const lines: string[] = [];
    lines.push(styleText("dim", `✓ Using ${detection.manager}`));
    lines.push(detection.package_json ? styleText("dim", "✓ package.json") : styleText("red", "✘ package.json not found"));
    lines.push(detection.vite         ? styleText("dim", "✓ vite.config") : styleText("red", "✘ vite.config not found"));
    if (detection.package_json) {
        lines.push("")
        lines.push(styleText("dim", "Standard Directories:"));
        switch (detection.imports.assets) {
            case "none": { lines.push(" - [assets] not found"); break; }
            case "exists": { lines.push(styleText("yellow", " - [assets] found, not configured")); break; }
            case "set": { lines.push(styleText("dim", " - [assets] ok")); break; }
            case "missing": { lines.push(styleText("yellow", " - [assets] configured, not found")); break; }
            case "unexpected": { lines.push(styleText("yellow", " - [assets] unexpected config")); break; }
        }
    }
    note(lines.join("\n"), "Welcome to Llama!");

    const command = await select({
        message: "Please Select a Tool",
        options: [
            { label: "New Project", value: "scaffold" },
            { label: "Repair Standard Directories", value: "standard" },
            { label: "Check Assets", value: "assets-check" },
            { label: "Import Assets", value: "assets-import" },
        ]
    });

    if (isCancel(command)) return false;

    return true;
}