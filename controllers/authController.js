import bcrypt from 'bcrypt';
import { createUser, findUserByUsername } from '../models/user.model.js';

export async function loginUser(username, password){
    const user = await findUserByUsername(username);
    if(!user){
        throw new Error("User not found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch){
        throw new Error("Invalid password");
    }

    return {
        id: user.id,
        username: user.username,
        message: "ok"
    };
}
