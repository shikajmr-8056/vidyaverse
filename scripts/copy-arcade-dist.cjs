const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

const sourceDist = 'D:/repos/vidyaverse_games/apps/web/dist';
const targetArcade = 'D:/repos/pixel-perfect-match-9202/public/arcade';
const targetPublic = 'D:/repos/pixel-perfect-match-9202/public';

console.log('Copying arcade dist to public/arcade...');
copyRecursiveSync(sourceDist, targetArcade);

// Also copy assets folders that might be fetched from root /images, /solar, /anatomy, /maps, /models, /physics
const assetFolders = ['anatomy', 'draco', 'images', 'maps', 'models', 'physics', 'solar'];
for (const folder of assetFolders) {
  const src = path.join(sourceDist, folder);
  if (fs.existsSync(src)) {
    const dest = path.join(targetPublic, folder);
    console.log(`Copying ${folder} to public/${folder}...`);
    copyRecursiveSync(src, dest);
  }
}

console.log('Copy complete!');
