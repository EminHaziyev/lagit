import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const username = req.user.username;
    if (!username) {
      return cb(new Error('Username is required'));
    }
    const dest = path.join('uploads', username);

    fs.mkdirSync(dest, { recursive: true }); // create if not exists
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const repoName = req.body.repoName;
    cb(null, `${repoName}.tar`);
  }
});

export const upload = multer({ storage });
