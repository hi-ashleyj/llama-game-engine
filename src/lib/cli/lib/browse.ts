import { access } from "node:fs/promises";
import { join } from "node:path";

export const exists = async (path: string) => {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
};

export const browse = (...path: string[]) => {
    return join(process.cwd(), ...path);
}

export const folder = (...path: string[]) => {
    return (...next: string[]) => {
        return browse(...path, ...next);
    }
}