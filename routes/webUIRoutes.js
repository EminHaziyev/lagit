import express from "express";
import { authMiddleware, authParser } from "../middleware/authMiddleware.js";
import { loginUser } from "../controllers/authController.js";
import { listRepos } from "../models/repo.model.js";
import { getFolderContents } from "../controllers/getFolderStructure.js";
import { findRepoByName } from "../models/repo.model.js";
import path from "path";
import fs from "fs";
import fsPromises from 'fs/promises';
import { create } from "domain";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const repos = await listRepos();
    res.render("index", { repos });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching repositories", error: err.message });
  }
});

router.get("/repo/:userName/:repoName/{*fullPath}", async (req, res) => {
  const { userName, repoName } = req.params;
  const relPath = req.params.fullPath; // Wildcard part
  const basePath = path.join("uploads", userName, repoName);
  const repoInfo = await findRepoByName(repoName);
  console.log("Repo info:", repoInfo);
  console.log("Requested subpath:", relPath);
  const extname = path.extname(path.join(basePath + relPath)).toLowerCase();
  console.log("Extension name:", extname);

  const textFileExtensions = [
      ".txt",
      ".log",
      ".js",
      ".ts",
      ".java",
      ".py",
      ".c",
      ".cpp",
      ".h",
      ".html",
      ".css",
      ".json",
      ".md",
      ".sh",
      ".rb",
      ".go",
      ".rs",
    ];

    if (textFileExtensions.includes(extname)) {
      
      const data = await fsPromises.readFile(path.join(basePath, relPath.join("/")), "utf8");
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      return res.send(data); // Stop execution after sending response
    }
  try {
    let result = {};
    if (relPath) {
      result = getFolderContents(basePath, relPath.join("/"));
    } else {
      result = getFolderContents(basePath, "");
    }

    

    res.render("repo", {
      name: repoInfo.name,
      created_at: repoInfo.created_at,
      folderStructure: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching folder structure",
      error: err.message,
    });
  }
});

export default router;
