import { Buffer } from "buffer";
import { loginUser } from "../controllers/authController.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({ message: "Authorization required" });
  }

  try {
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");

    const user = await loginUser(username, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Authentication error", error: err.message });
  }
}


export function authParser(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Basic ")) {
        return res.status(401).send("Missing or invalid Authorization header");
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");

    if (!username || !password) {
        return res.status(400).send("Username and password required");
    }

    req.auth = { username, password };
    next();
}
