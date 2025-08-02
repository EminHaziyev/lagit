import fs from "fs";
import path from "path"
import axios from "axios"
export default function init(username, password){
    const lagitFolder = path.join(process.cwd(), ".lagit");

    if(fs.existsSync(lagitFolder)){
        console.log("Folder is already a lagit repository");
        return;
    }
    try {
        // LOGIN THE USER
        const userData = {
            "username": "emin",
            "password": "123"
        }
        fs.mkdirSync(lagitFolder);
        const configFilePath = path.join(lagitFolder, "config.json");
        fs.writeFileSync(configFilePath, JSON.stringify(userData, null, 2));

        console.log("User logged in and foler initialized as lagit repository.")
    } catch (error) {
        console.log("Error occured while initializing repository:", error)
    }
}