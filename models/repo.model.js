import { connectToDb } from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const tar = await import("tar");

export async function createRepo(repoName, username, tarPath) {
  const db = await connectToDb();
  try {
    const results = await db.run(
      "INSERT INTO repositories (name, user_id) VALUES(?, (SELECT id FROM users WHERE username = ?))",
      repoName,
      username
    );
    const folder = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "..",
      "uploads",
      username,
      repoName
    );
    fs.mkdirSync(folder, { recursive: true });
    const configData = {
      repoName,
      username,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    const configPath = path.join(folder, "repo.config.js");
    fs.writeFileSync(
      configPath,
      `export default ${JSON.stringify(configData, null, 2)};\n`
    );

    await tar.x({
      file: tarPath,
      cwd: folder,
    });

    fs.unlinkSync(tarPath);
    return {
      id: results.lastID,
      name: repoName,
      user: username,
    };
  } catch (err) {
    throw err;
  }
}

export async function findRepoByName(repoName) {
  const db = await connectToDb();

  const results = await db.get(
    "SELECT * FROM repositories WHERE name = ?",
    repoName
  );

  return results;
}

export async function updateRepo(repoName, username, tarPath, commitMessage) {
  const repoDir = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "uploads",
    username,
    repoName
  );

  if (!fs.existsSync(repoDir)) {
    throw new Error("Repository does not exist");
  }

  const files = fs.readdirSync(repoDir);
  for (const file of files) {
    if (file !== "repo.config.js") {
      const filePath = path.join(repoDir, file);
      fs.rmSync(filePath, { recursive: true, force: true });
    }
  }

  await tar.x({
    file: tarPath,
    cwd: repoDir,
  });

  const configPath = path.join(repoDir, "repo.config.js");
  const configModule = await import(`file://${configPath}`);
  const config = {
    ...configModule.default,
    lastUpdated: new Date().toISOString(),
    commitMessage: commitMessage || "Updated repository",
    updatedBy: username,
  };
  fs.writeFileSync(
    configPath,
    `export default ${JSON.stringify(config, null, 2)};\n`
  );
  fs.unlinkSync(tarPath);

  return { message: "Repository updated successfully" };
}




export async function cloneRepo(repoName, username) {
  const baseDir = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "uploads",
    username,
    repoName
  );

  if (!fs.existsSync(baseDir)) {
    throw new Error("Repository does not exist");
  }

  const tarOutputPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "uploads",
    username,
    `${repoName}.tar`
  );

  // Remove if already exists
  if (fs.existsSync(tarOutputPath)) {
    fs.unlinkSync(tarOutputPath);
  }

  // Create the tar including all files
  await tar.c(
    {
      gzip: false,
      file: tarOutputPath,
      cwd: baseDir,
    },
    fs.readdirSync(baseDir) // include all files including repo.config.js
  );

  return tarOutputPath;
}


export async function deleteRepo(repoName, username) {
  const db = await connectToDb();

  // 1. Delete from DB
  const result = await db.run(
    "DELETE FROM repositories WHERE name = ? AND user_id = (SELECT id FROM users WHERE username = ?)",
    repoName,
    username
  );

  if (result.changes === 0) {
    throw new Error("Repository not found or user does not have permission.");
  }

  // 2. Delete folder
  const repoPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "uploads",
    username,
    repoName
  );

  if (fs.existsSync(repoPath)) {
    fs.rmSync(repoPath, { recursive: true, force: true });
  }

  return { message: "Repository deleted successfully", repoName };
}
