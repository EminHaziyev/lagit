import fs from "fs";
import path from "path";

export async function commit(message) {
  try {
    const cwd = process.cwd();
    const lagitFolder = path.join(cwd, ".lagit");
    if (!fs.existsSync(lagitFolder)) {
      console.error(
      "Error: .lagit folder does not exist. Please check lagit initialization: lagit init-login -h"
    );
      return;
    }
    const configFilePath = path.join(lagitFolder, "config.json");
    let userData = {};
    if (fs.existsSync(configFilePath)) {
      userData = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
    }
    const updatedUserData = { ...userData, commitMessage: message };
    fs.writeFileSync(configFilePath, JSON.stringify(updatedUserData, null, 2));
    console.log(
      "Added commit message successfully. You can now push your changes."
    );
  } catch (error) {
    console.log("Error occured while doing operation:", error);
  }
}
