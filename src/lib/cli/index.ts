import { program } from "commander";
import * as commands from "./commands/index.js";

if (process.argv.slice(2).length > 0) {
    
}

program.name("Llama");
//program.addCommand(command)
program.parse();