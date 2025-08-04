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
    const response = await axios.post(
      "http://localhost:3000/api/login",
      {}, // No body, as credentials are in auth header
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${username}:${password}`).toString("base64"),
        },
      }
    );

    const userData = {
      username: username,
      password: password,
    };

    fs.mkdirSync(lagitFolder);
    const configFilePath = path.join(lagitFolder, "config.json");
    fs.writeFileSync(configFilePath, JSON.stringify(userData, null, 2));

    console.log("User logged in and folder initialized as lagit repository.");
  } catch (error) {
    if (error.response) {
      console.log("Login failed:", error.response.data || error.response.statusText);
    } else {
      console.log("Network or server error:", error.message);
    }
  }
}
