import fs from "fs";
import path from "path";
const tar = await import('tar');
import fetch from "node-fetch";
import FormData from "form-data";
import os from "os";

export async function create(repoName) {
  try {
    const cwd = process.cwd();
    const lagitFolder = path.join(cwd, ".lagit");
    const configFilePath = path.join(lagitFolder, "config.json");
    
    let userData = {};
    if (fs.existsSync(configFilePath)) {
      userData = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
    }
    // Define your commit message here, e.g. prompt the user or set a default
    const message = "Your commit message here";
    const updatedUserData = { 
      ...userData, 
      repoName: repoName,
    };
    fs.writeFileSync(configFilePath, JSON.stringify(updatedUserData, null, 2));
    const response = await fetch("http://localhost:3000/api/repo/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(`${userData.username}:${userData.password}`).toString("base64"),
      },
      body: JSON.stringify({ repoName }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Push failed:", errorText);
    } else {
      console.log("Push successful");
    }
    console.log(
      "Added commit message successfully. You can now push your changes."
    );
  } catch (error) {
    console.log("Error occured while doing operation:", error);
  }
}
