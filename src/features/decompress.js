import fs from "fs";
import path from "path";
import { createBrotliDecompress } from "zlib";
import { pipeline } from "stream/promises";
import { getPath } from "../utils/getPath.js";

export const decompress = async (sourceFilePath, destinationPath) => {
  try {
    if (!sourceFilePath || !destinationPath) {
      throw new Error(
        "Both source file path and destination path are required"
      );
    }

    const currentPath = getPath();
    const absoluteSourcePath = path.resolve(currentPath, sourceFilePath);
    let absoluteDestinationPath = path.resolve(currentPath, destinationPath);

    const sourceStats = await fs.promises.stat(absoluteSourcePath);
    if (!sourceStats.isFile()) {
      throw new Error("Source path is not a file");
    }

    try {
      const destStats = await fs.promises.stat(absoluteDestinationPath);
      if (destStats.isDirectory()) {
        let sourceFileName = path.basename(sourceFilePath);
        if (sourceFileName.endsWith(".br")) {
          sourceFileName = sourceFileName.slice(0, -3);
        }
        absoluteDestinationPath = path.join(
          absoluteDestinationPath,
          sourceFileName
        );
      }
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    const readStream = fs.createReadStream(absoluteSourcePath);
    const brotliDecompress = createBrotliDecompress();
    const writeStream = fs.createWriteStream(absoluteDestinationPath);

    await pipeline(readStream, brotliDecompress, writeStream);

    console.log(
      `File "${sourceFilePath}" decompressed successfully to "${path.relative(
        currentPath,
        absoluteDestinationPath
      )}"`
    );
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(`Error: File "${sourceFilePath}" does not exist`);
    } else if (error.code === "EISDIR") {
      console.error(`Error: "${sourceFilePath}" is a directory, not a file`);
    } else if (error.code === "EACCES") {
      console.error(
        `Error: Permission denied accessing "${sourceFilePath}" or "${destinationPath}"`
      );
    } else if (
      error.message.includes("incorrect header check") ||
      error.message.includes("invalid") ||
      error.code === "Z_DATA_ERROR"
    ) {
      console.error(
        `Error: "${sourceFilePath}" is not a valid Brotli compressed file`
      );
    } else {
      console.error(`Error decompressing file: ${error.message}`);
    }
  }
};
