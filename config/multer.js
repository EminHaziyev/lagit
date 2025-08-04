import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const username = req.user.username;
    if (!username) {
      return cb(new Error("Username is required"));
    }
    const dest = path.join("uploads", username);

    fs.mkdirSync(dest, { recursive: true }); // create if not exists
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    let safeName = file.originalname;

    const match = file.originalname.match(/(.*)\.tar$/);
    if (match) {
      safeName = `${match[1]}.tar`;
    }

    cb(null, safeName);
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    fieldSize: 10 * 1024 * 1024, // 10MB field limit
  },
});

export const upload = multer({ storage });
