import fs from 'fs';
import path from 'path';

export function getFolderContents(basePath, relPath = '') {
  const fullPath = path.join(basePath, relPath);

  if (!fs.existsSync(fullPath)) {
    throw new Error('Path does not exist: ' + fullPath);
  }

  const stats = fs.statSync(fullPath);
  if (stats.isFile()) {
    // If the path is a file, return that single file
    return [{
      type: 'file',
      name: path.basename(fullPath),
      path: relPath
    }];
  }

  // Directory case: list only immediate contents
  const items = fs.readdirSync(fullPath);

  return items.map(name => {
    const itemPath = path.join(fullPath, name);
    const itemRelPath = path.join(relPath, name);
    const itemStats = fs.statSync(itemPath);

    return {
      type: itemStats.isDirectory() ? 'folder' : 'file',
      name,
      path: itemRelPath
    };
  });
}
