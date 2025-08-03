import { connectToDb } from "../config/db.js";
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from "url";

export async function createRepo(repoName, username){
    const db = await connectToDb();
    try{
        const results = await db.run(
            'INSERT INTO repositories (name, user_id) VALUES(?, (SELECT id FROM users WHERE username = ?))', repoName, username
        )
        const folder = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads', username, repoName);
        fs.mkdirSync(folder, {recursive: true});
        return {
            id: results.lastID,
            name: repoName,
            user: username
        };
    }
    catch(err){
        throw err;
    }
}

export async function findRepoByName(repoName, username){
    const db = await connectToDb();

    const results = await db.get(
        'SELECT * FROM repositories WHERE name = ? AND user_id = (SELECT id FROM users WHERE username = ?)', repoName, username
    );

    return results;
}