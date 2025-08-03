import { connectToDb } from "../config/db.js";
import bcrypt from 'bcrypt';
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from "url";

export async function createUser(username , password){
    const db = await connectToDb();
    try{
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const results = await db.run(
            'INSERT INTO users (username, password) VALUES(?, ?)',
            [username, hashedPassword]
        );

        const folder = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads', username);        fs.mkdirSync(folder, {recursive: true});
        fs.mkdirSync(folder, {recursive: true});

        return {
            id: results.lastID,
            username
        };
    
    }
    catch(err){
        throw err;
    }

}


export async function findUserByUsername(username){
    const db = await connectToDb();

    const results = await db.get(
        'SELECT * FROM users WHERE username = ?', username
    );

    return results;
}



