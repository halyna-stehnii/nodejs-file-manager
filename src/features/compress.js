import fs from "fs";
import path from "path";
import { createBrotliCompress } from "zlib";
import { pipeline } from "stream/promises";
import { getPath } from "../utils/getPath.js";

export const compress = async (sourceFilePath, destinationPath) => {
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
        const sourceFileName = path.basename(sourceFilePath);
        const compressedFileName = sourceFileName + ".br";
        absoluteDestinationPath = path.join(
          absoluteDestinationPath,
          compressedFileName
        );
      }
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    const readStream = fs.createReadStream(absoluteSourcePath);

    const brotliCompress = createBrotliCompress();

    const writeStream = fs.createWriteStream(absoluteDestinationPath);

    await pipeline(readStream, brotliCompress, writeStream);

    console.log(
      `File "${sourceFilePath}" compressed successfully to "${path.relative(
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
    } else {
      console.error(`Error compressing file: ${error.message}`);
    }
  }
};
