import fs from "fs";
import path from "path";
import os from "os";
const tar = await import('tar');
import fetch from "node-fetch";

export async function pullRepo() {
  const cwd = process.cwd();
  const lagitFolder = path.join(cwd, ".lagit");
   if (!fs.existsSync(lagitFolder)) {
console.error(
      "Error: .lagit folder does not exist. Please check lagit initialization: lagit init-login -h"
    );
    return;
  }
  const configFilePath = path.join(lagitFolder, "config.json");
  const configRaw = fs.readFileSync(configFilePath, "utf-8");
  const config = JSON.parse(configRaw);
  const repoName = config.repoName;
  if (!repoName) {
    console.error(
      "Not a lagit repository. Please run `lagit clone <repoName>` or create a repository first."
    );
    return;
  }

  try {
    console.log("Pulling repository...");
    config.repoName;
    const response = await fetch("http://localhost:3000/api/repo/clone", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
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
      response.body.on("error", reject);
      fileStream.on("finish", resolve);
    });

    // Extract the tar into current directory
    await tar.x({
      file: tarPath,
      cwd: cwd,
    });

    // Clean up the tar file
    fs.unlinkSync(tarPath);

    // Add repoName field to existing config.json
    config.repoName = repoName;
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
    console.log(`Repository ${repoName} pulled successfully.`);
  } catch (err) {
    console.error("Error during pull:", err.message);
  }
}
