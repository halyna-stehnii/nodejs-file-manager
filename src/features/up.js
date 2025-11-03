import process from "process";
import path from "path";
import { getPath } from "../utils/getPath.js";

export const up = () => {
  const currentPath = getPath();
  const parentPath = path.dirname(currentPath);

  if (currentPath === parentPath) {
    console.log("Already at the root directory");
    return;
  }

  try {
    process.chdir(parentPath);
    console.log(`You are currently in ${getPath()}`);
  } catch (error) {
    console.error(`Error navigating up: ${error.message}`);
  }
};
