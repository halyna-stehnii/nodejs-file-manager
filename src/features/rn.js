import fs from "fs/promises";
import path from "path";
import { getPath } from "../utils/getPath.js";

export const rn = async (filePath, newFilename) => {
  try {
    if (!filePath) {
      console.log("Operation failed: No file path provided");
      return;
    }

    if (!newFilename) {
      console.log("Operation failed: No new filename provided");
      return;
    }

    const currentDir = getPath();
    const sourceFile = path.resolve(currentDir, filePath);

    const sourceDir = path.dirname(sourceFile);
    const destinationFile = path.join(sourceDir, newFilename);

    try {
      await fs.access(sourceFile);
    } catch (error) {
      console.log(`Operation failed: Source file does not exist`);
      return;
    }

    try {
      await fs.access(destinationFile);
      console.log(
        `Operation failed: File with name '${newFilename}' already exists`
      );
      return;
    } catch (error) {
      console.log(`Operation failed: Destination file already exists`);
    }

    await fs.rename(sourceFile, destinationFile);
    console.log(
      `File renamed successfully from '${path.basename(
        sourceFile
      )}' to '${newFilename}'`
    );
  } catch (error) {
    console.log(`Operation failed: ${error.message}`);
  }
};
