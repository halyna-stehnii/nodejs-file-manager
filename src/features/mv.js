import fs from "fs";
import path from "path";
import { getPath } from "../utils/getPath.js";

export const mv = async (sourceFilePath, destinationPath) => {
  try {
    if (!sourceFilePath || !destinationPath) {
      console.log(
        "Operation failed: Please provide both source file path and destination path"
      );
      return;
    }

    const resolvedSourcePath = path.resolve(getPath(), sourceFilePath);
    const resolvedDestinationPath = path.resolve(getPath(), destinationPath);

    try {
      const sourceStats = await fs.promises.stat(resolvedSourcePath);
      if (sourceStats.isDirectory()) {
        console.log("Operation failed: Source path is a directory, not a file");
        return;
      }
    } catch (error) {
      console.log(
        `Operation failed: Source file does not exist - ${error.message}`
      );
      return;
    }

    try {
      const destStats = await fs.promises.stat(resolvedDestinationPath);
      if (!destStats.isDirectory()) {
        console.log("Operation failed: Destination path is not a directory");
        return;
      }
    } catch (error) {
      console.log(
        `Operation failed: Destination directory does not exist - ${error.message}`
      );
      return;
    }

    const fileName = path.basename(resolvedSourcePath);
    const finalDestinationPath = path.join(resolvedDestinationPath, fileName);

    try {
      await fs.promises.stat(finalDestinationPath);
      console.log(
        "Operation failed: File already exists in destination directory"
      );
      return;
    } catch (error) {
      console.log(error);
    }

    const readableStream = fs.createReadStream(resolvedSourcePath);
    const writableStream = fs.createWriteStream(finalDestinationPath);

    readableStream.on("error", (error) => {
      console.log(
        `Operation failed: Error reading source file - ${error.message}`
      );
      writableStream.destroy();
    });

    writableStream.on("error", (error) => {
      console.log(
        `Operation failed: Error writing to destination - ${error.message}`
      );
      readableStream.destroy();
    });

    readableStream.pipe(writableStream);

    return new Promise((resolve, reject) => {
      writableStream.on("finish", async () => {
        try {
          await fs.promises.unlink(resolvedSourcePath);
          console.log(`File moved successfully to ${finalDestinationPath}`);
          resolve();
        } catch (error) {
          console.log(
            `Operation failed: File copied but could not delete original - ${error.message}`
          );
          reject(error);
        }
      });

      readableStream.on("error", reject);
      writableStream.on("error", reject);
    });
  } catch (error) {
    console.log(`Operation failed: ${error.message}`);
  }
};
