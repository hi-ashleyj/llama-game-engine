import { program } from "commander";
import { pick } from "./commands/index.js";
import { intro, cancel } from "@clack/prompts";

intro("Llama Game Engine CLI (@hi-ashleyj/llama)");

if (process.argv.slice(2).length <= 0) {
    const res = await pick();
    if (!res) cancel("Sad Llama ToT");
    process.exit(0);
}

program.name("Llama Game Engine CLI");
//program.addCommand(command)
program.parse();