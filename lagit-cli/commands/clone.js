import fs from "fs";
import path from "path";
import os from "os";
const tar = await import("tar");
import fetch from "node-fetch";

export async function cloneRepo(repoName) {
  const cwd = process.cwd();
  const lagitFolder = path.join(cwd, ".lagit");
  const configFilePath = path.join(lagitFolder, "config.json");

  if (!fs.existsSync(lagitFolder)) {
    console.error(
      "Error: .lagit folder does not exist. Please check lagit initialization: lagit init-login -h"
    );
    return;
  }
  let config;
  try {
    const configRaw = fs.readFileSync(configFilePath, "utf-8");
    config = JSON.parse(configRaw);
  } catch (err) {
    console.error("Failed to read or parse config.json:", err.message);
    return;
  }

  if (config.repoName) {
    console.error("Already a lagit repository: " + config.repoName);
    return;
  }

  try {
    console.log("Cloning repository...");

    if (!config.username || !config.password) {
      throw new Error("Missing username or password in config");
    }

    const response = await fetch("http://localhost:3000/api/repo/clone", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${config.username}:${config.password}`).toString(
            "base64"
          ),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repoName }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Clone failed: ${text}`);
    }

    // Save tar to a temp file
    const tarPath = path.join(os.tmpdir(), `repo-${Date.now()}.tar`);
    const fileStream = fs.createWriteStream(tarPath);

    await new Promise((resolve, reject) => {
      response.body.pipe(fileStream);
      response.body.on("error", (err) => {
        fileStream.close();
        reject(err);
      });
      fileStream.on("finish", resolve);
      fileStream.on("error", (err) => {
        fileStream.close();
        reject(err);
      });
    });

    try {
      // Extract the tar into current directory
      await tar.x({
        file: tarPath,
        cwd: cwd,
      });
    } catch (extractErr) {
      throw new Error(`Failed to extract tar archive: ${extractErr.message}`);
    } finally {
      // Clean up the tar file
      try {
        if (fs.existsSync(tarPath)) {
          fs.unlinkSync(tarPath);
        }
      } catch (cleanupErr) {
        console.warn(
          `Failed to delete temporary tar file: ${cleanupErr.message}`
        );
      }
    }

    // Add repoName field to existing config.json
    config.repoName = repoName;
    try {
      fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
    } catch (writeErr) {
      throw new Error(`Failed to update config.json: ${writeErr.message}`);
    }

    console.log("Repository cloned successfully.");
  } catch (err) {
    console.error("Error during clone:", err.message);
  }
}
