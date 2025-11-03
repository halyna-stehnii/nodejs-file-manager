import fs from "fs/promises";
import path from "path";
import { getPath } from "../utils/getPath.js";

export const add = async (fileName) => {
  try {
    if (!fileName) {
      throw new Error("File name is required");
    }

    const currentPath = getPath();
    const filePath = path.join(currentPath, fileName);

    await fs.writeFile(filePath, "", { encoding: "utf8", flag: "wx" });

    console.log(`File "${fileName}" created successfully in ${currentPath}`);
  } catch (error) {
    if (error.code === "EEXIST") {
      console.error(`Error: File "${fileName}" already exists`);
    } else {
      console.error(`Error creating file: ${error.message}`);
    }
  }
};
