import os from "os";

export const osInfo = (operation) => {
  try {
    switch (operation) {
      case "--EOL":
        console.log(`End-Of-Line (EOL): ${JSON.stringify(os.EOL)}`);
        break;
      case "--cpus":
        const cpus = os.cpus();
        console.log(`Number of CPUs: ${cpus.length}`);
        console.log("CPU info:");
        cpus.forEach((cpu, index) => {
          console.log(`  CPU ${index + 1}: ${cpu.model} at ${cpu.speed}MHz`);
        });
        break;
      case "--homedir":
        console.log(`Home directory: ${os.homedir()}`);
        break;
      case "--username":
        console.log(`Username: ${os.userInfo().username}`);
        break;
      case "--architecture":
        console.log(`Architecture: ${os.arch()}`);
        break;
      default:
        console.log("Operation failed: Invalid operation.");
        break;
    }
  } catch (error) {
    console.error(`Error getting OS info: ${error.message}`);
  }
};
