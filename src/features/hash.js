import { createHash } from "crypto";
import { createReadStream } from "fs";
import { access, constants } from "fs/promises";
import path from "path";
import { getPath } from "../utils/getPath.js";

export const hash = async (filePath) => {
  try {
    const resolvedPath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(getPath(), filePath);

    await access(resolvedPath, constants.F_OK | constants.R_OK);

    const hash = createHash("sha256");
    const stream = createReadStream(resolvedPath);

    return new Promise((resolve, reject) => {
      stream.on("error", (error) => {
        console.log(`Operation failed: ${error.message}`);
        reject(error);
      });

      stream.on("data", (chunk) => {
        hash.update(chunk);
      });

      stream.on("end", () => {
        const hashValue = hash.digest("hex");
        console.log(`Hash for file "${filePath}": ${hashValue}`);
        resolve(hashValue);
      });
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(`Operation failed: File "${filePath}" not found`);
    } else if (error.code === "EACCES") {
      console.log(
        `Operation failed: Permission denied to read file "${filePath}"`
      );
    } else {
      console.log(`Operation failed: ${error.message}`);
    }
  }
};
