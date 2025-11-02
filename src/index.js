import { createInterface } from "readline";
import process from "process";
import { getPath } from "./utils/getPath.js";

const args = process.argv.slice(2);
let username = "User";

for (const arg of args) {
  if (arg.startsWith("--username=")) {
    username = arg.split("=")[1];
    break;
  }
}

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
  } else {
    console.log(`Command received: ${command}`);
    console.log(`You are currently in ${getPath()}`);
    rl.prompt();
  }
});

rl.prompt();
