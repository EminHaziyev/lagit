import fs from "fs";
import path from "path";
const tar = await import("tar");
import fetch from "node-fetch";
import FormData from "form-data";
import os from "os";
import axios from "axios";

export async function push() {
  const cwd = process.cwd();
  const lagitFolder = path.join(cwd, ".lagit");
  const configFilePath = path.join(lagitFolder, "config.json");
  if (!fs.existsSync(lagitFolder)) {
    console.error(
      "Error: .lagit folder does not exist. Please check lagit initialization: lagit init-login -h"
    );
    return;
  }
  if (!fs.existsSync(configFilePath)) {
    console.error("Not a lagit repository. TODO");
    return;
  }

  const config = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
  const { username, password, commitMessage, repoName } = config;

  if (!username || !password || !commitMessage) {
    console.error("You did not set your commit message. Please do: lagit commmit -h");
    return;
  }

  const tarPath = path.join(os.tmpdir(), `${repoName}.tar`);

  try {
    await tar.c(
      {
        gzip: false,
        file: tarPath,
        cwd,
        filter: (filePath) => !filePath.startsWith(".lagit"),
      },
      fs.readdirSync(cwd)
    );

    // Upload tarball + commit message
    const formData = new FormData();
    formData.append("repo", fs.createReadStream(tarPath));
    formData.append("commitMessage", commitMessage);
    formData.append("repoName", repoName);

    const response = await axios.put(
      "http://localhost:3000/api/repo/update",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization:
            "Basic " +
            Buffer.from(`${username}:${password}`).toString("base64"),
        },
        maxBodyLength: Infinity,
        timeout: 300000,
      }
    );

    console.log("Push successful:", response.data);
  } catch (err) {
    console.error("Error during push:", err.message);
  } finally {
    //Cleanup
    if (fs.existsSync(tarPath)) {
      fs.unlinkSync(tarPath);
    }
  }
}
