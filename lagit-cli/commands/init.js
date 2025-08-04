import fs from "fs";
import path from "path";
import axios from "axios";
export async function initAndlogin(username, password) {
  const lagitFolder = path.join(process.cwd(), ".lagit");

  if (fs.existsSync(lagitFolder)) {
    console.log("Folder is already a lagit repository");
    return;
  }
  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Login failed:", errorText);
      return;
    }

    const userData = {
      username: username,
      password: password,
    };
    fs.mkdirSync(lagitFolder);
    const configFilePath = path.join(lagitFolder, "config.json");
    fs.writeFileSync(configFilePath, JSON.stringify(userData, null, 2));

    console.log("User logged in and foler initialized as lagit repository.");
  } catch (error) {
    console.log("Error occured while initializing repository:", error);
  }
}
