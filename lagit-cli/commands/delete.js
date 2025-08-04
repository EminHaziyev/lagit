import fs from "fs";
import path from "path";
import fetch from "node-fetch";

export async function deleteRepoApi(repoName) {
  try {
    const cwd = process.cwd();
    const lagitFolder = path.join(cwd, ".lagit");
    const configFilePath = path.join(lagitFolder, "config.json");
    if (!fs.existsSync(lagitFolder)) {
      console.error(
      "Error: .lagit folder does not exist. Please check lagit initialization: lagit init-login -h"
    );
      return;
    }
    let userData = {};
    if (fs.existsSync(configFilePath)) {
      userData = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
    } else {
      throw new Error("User config not found. Please login first.");
    }

    const username = userData.username;

    // Call your backend API to delete repo (adjust URL if different)
    const response = await fetch(`http://localhost:3000/api/repo/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(`${userData.username}:${userData.password}`).toString(
            "base64"
          ),
      },
      body: JSON.stringify({ repoName, username }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Delete failed:", errorText);
    } else {
      console.log("Delete successful");
    }
  } catch (error) {
    console.error("Error occurred while deleting repository:", error);
  }
}
