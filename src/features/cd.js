import process from "process";
import path from "path";
import { existsSync } from "fs";
import { getPath } from "../utils/getPath.js";

export const cd = (pathToDirectory) => {
  if (!pathToDirectory) {
    console.error("Error: Path is required");
    return;
  }

  const currentPath = getPath();

  const targetPath = path.resolve(currentPath, pathToDirectory);

  if (!existsSync(targetPath)) {
    console.error(`Error: Directory '${pathToDirectory}' does not exist`);
    return;
  }

  try {
    process.chdir(targetPath);
    console.log(`You are currently in ${getPath()}`);
  } catch (error) {
    console.error(`Error changing directory: ${error.message}`);
  }
};
