import fs from "fs/promises";
import path from "path";
import { getPath } from "../utils/getPath.js";

export const mkdir = async (directoryName) => {
  try {
    if (!directoryName) {
      throw new Error("Directory name is required");
    }

    const currentPath = getPath();
    const directoryPath = path.join(currentPath, directoryName);

    await fs.mkdir(directoryPath);

    console.log(
      `Directory "${directoryName}" created successfully in ${currentPath}`
    );
  } catch (error) {
    if (error.code === "EEXIST") {
      console.error(`Error: Directory "${directoryName}" already exists`);
    } else {
      console.error(`Error creating directory: ${error.message}`);
    }
  }
};
