import fs from "fs";
import path from "path";
import process from "process";
import { getPath } from "../utils/getPath.js";

export const cat = async (filePath) => {
  try {
    if (!filePath) {
      console.log("Operation failed: No file path provided");
      return;
    }

    const resolvedPath = path.resolve(getPath(), filePath);

    try {
      const stats = await fs.promises.stat(resolvedPath);
      if (stats.isDirectory()) {
        console.log("Operation failed: Path is a directory, not a file");
        return;
      }
    } catch (error) {
      console.log(`Operation failed: ${error.message}`);
      return;
    }

    const readableStream = fs.createReadStream(resolvedPath, {
      encoding: "utf8",
    });

    readableStream.on("data", (chunk) => {
      process.stdout.write(chunk);
    });

    readableStream.on("end", () => {
      process.stdout.write("\n");
    });

    readableStream.on("error", (error) => {
      console.log(`Operation failed: ${error.message}`);
    });

    return new Promise((resolve, reject) => {
      readableStream.on("end", resolve);
      readableStream.on("error", reject);
    });
  } catch (error) {
    console.log(`Operation failed: ${error.message}`);
  }
};
