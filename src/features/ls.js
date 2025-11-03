import fs from "fs/promises";
import path from "path";
import process from "process";

export const ls = async () => {
  try {
    const currentDir = process.cwd();
    const items = await fs.readdir(currentDir);

    const itemsWithType = [];

    for (const item of items) {
      try {
        const itemPath = path.join(currentDir, item);
        const stats = await fs.stat(itemPath);

        itemsWithType.push({
          name: item,
          type: stats.isDirectory() ? "directory" : "file",
        });
      } catch (error) {
        continue;
      }
    }

    const sortedItems = itemsWithType.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === "directory" ? -1 : 1;
    });

    console.log("");
    console.log("┌───────┬─────────────────────────────┬─────────────┐");
    console.log("│ Index │ Name                        │ Type        │");
    console.log("├───────┼─────────────────────────────┼─────────────┤");

    sortedItems.forEach((item, index) => {
      const paddedIndex = index.toString().padEnd(5);
      const paddedName = `'${item.name}'`.padEnd(27);
      const paddedType = `'${item.type}'`.padEnd(11);
      console.log(`│ ${paddedIndex} │ ${paddedName} │ ${paddedType} │`);
    });

    console.log("└───────┴─────────────────────────────┴─────────────┘");
    console.log("");
  } catch (error) {
    console.log(`Operation failed: ${error.message}`);
  }
};
