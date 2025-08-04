import {findRepoByName} from '../models/repo.model.js';

export async function repoCheckerMiddleware(req, res, next) {
    const { repoName } = req.body;

    if (!repoName) {
        return res.status(400).json({ message: "Repository name is required" });
    }

    try {
        const repo = await findRepoByName(repoName);
        if (repo) {
            return res.status(409).json({ message: "Repository already exists" });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: "Error checking repository", error: err.message });
    }
}

export async function repoOwnerChecker(req, res, next) {
    const { repoName } = req.body;
    const { username } = req.user;

    if (!repoName) {
        return res.status(400).json({ message: "Repository name is required" });
    }

    try {
        const repo = await findRepoByName(repoName, username);
        if (!repo) {
            return res.status(404).json({ message: "Repository not found or you do not have permission to access it" });
        }
        if(repo.user_id !== req.user.id) {
            return res.status(403).json({ message: "You do not have permission to do this operation" });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: "Error checking repository ownership", error: err.message });
    }
}
