import fs from "fs";
import path from "path";
import axios from "axios";

export async function listReposApi() {
  try {
    const cwd = process.cwd();
    const lagitFolder = path.join(cwd, ".lagit");
    const configFilePath = path.join(lagitFolder, "config.json");

    if (!fs.existsSync(configFilePath)) {
      throw new Error("User config not found. Please login first.");
    }

    const userData = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
    const authHeader = "Basic " + Buffer.from(`${userData.username}:${userData.password}`).toString("base64");

    const response = await axios.get("http://localhost:3000/api/repo/list", {
      headers: {
        Authorization: authHeader,
      },
    });

    console.log(response.data);
  } catch (error) {
    console.error("Error fetching repositories:", error.message || error);
    throw error;
  }
}
