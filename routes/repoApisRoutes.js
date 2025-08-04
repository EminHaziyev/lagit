import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';
import { repoCheckerMiddleware, repoOwnerChecker } from '../middleware/repoCheckerMiddleware.js';
import { createRepo, updateRepo, cloneRepo, deleteRepo } from '../models/repo.model.js';
import { upload } from '../config/multer.js';


const router = express.Router();

router.post('/create', authMiddleware, repoCheckerMiddleware, upload.single('repo'), async (req, res) => {
    try{
        const { username } = req.user;
        const { repoName } = req.body;
        if (!repoName) {
            return res.status(400).json({ message: "Repository name is required" });
        }
        const tarPath = req.file.path;   
        const repo = await createRepo(repoName, username, tarPath);
        
        return res.status(201).json(repo.message);
    }
    catch(err){
        return res.status(500).json({ message: "Error creating repository", error: err.message });
    }
});



router.put('/update', authMiddleware, repoOwnerChecker, upload.single(repo), async (req, res) => {
    try{
        const { username } = req.user;
        const { repoName } = req.body;
        const { commitMessage } = req.body;
        if (!repoName) {
            return res.status(400).json({ message: "Repository name is required" });
        }

        const tarPath = req.file.path;   
        const repo = await updateRepo(repoName, username, tarPath , commitMessage);
        
        return res.status(201).json(repo.message);
    }
    catch(err){
        return res.status(500).json({ message: "Error creating repository", error: err.message });
    }
});


router.get("/clone", authMiddleware, async (req, res) => {
  try {
    const { username } = req.user;
    const { repoName } = req.body;

    const tarPath = await cloneRepo(repoName, username);
    res.download(tarPath, `${repoName}.tar`, (err) => {
      if (err) console.error(err);
      else fs.unlinkSync(tarPath); // remove after sending
    });
  } catch (err) {
    res.status(500).send(err.message || "Failed to pull repository");
  }
});

router.delete("/delete", authMiddleware, repoOwnerChecker, async (req, res) => {
  try {
    const { username } = req.user;
    const { repoName } = req.body;

    const result = await deleteRepo(repoName, username);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to delete repository" });
  }
});



export default router;