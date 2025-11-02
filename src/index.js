import { createInterface } from "readline";
import process from "process";
import { homedir } from "os";
import { getPath } from "./utils/getPath.js";
import { up } from "./features/up.js";
import { cd } from "./features/cd.js";

const args = process.argv.slice(2);
let username = "User";

for (const arg of args) {
  if (arg.startsWith("--username=")) {
    username = arg.split("=")[1];
    break;
  }
}

process.chdir(homedir());

console.log(`Welcome to the File Manager, ${username}!`);
console.log(`You are currently in ${getPath()}`);

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

const exitProgram = () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  rl.close();
  process.exit(0);
};

rl.on("SIGINT", () => {
  process.stdout.write("\n");
  exitProgram();
});

rl.on("line", (input) => {
  const command = input.trim();

  if (command === ".exit") {
    exitProgram();
  } else if (command === "up") {
    up();
    rl.prompt();
  } else if (command.startsWith("cd ")) {
    const pathToDirectory = command.substring(3).trim();
    cd(pathToDirectory);
    rl.prompt();
  } else {
    console.log(`Command received: ${command}`);
    console.log(`You are currently in ${getPath()}`);
    rl.prompt();
  }
});

rl.prompt();
