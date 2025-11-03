import fs from "fs/promises";
import path from "path";
import { getPath } from "../utils/getPath.js";

export const rm = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("File path is required");
    }

    const currentPath = getPath();
    const absoluteFilePath = path.resolve(currentPath, filePath);

    const stats = await fs.stat(absoluteFilePath);
    if (!stats.isFile()) {
      throw new Error("Path is not a file");
    }

    await fs.unlink(absoluteFilePath);

    console.log(`File "${filePath}" deleted successfully`);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(`Error: File "${filePath}" does not exist`);
    } else if (error.code === "EISDIR") {
      console.error(`Error: "${filePath}" is a directory, not a file`);
    } else {
      console.error(`Error deleting file: ${error.message}`);
    }
  }
};
