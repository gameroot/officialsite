const fs = require('fs-extra');
const path = require('path');
const config = require('config');

const srcDir = path.join(config.root, 'client/asset');
const distDir = path.join(config.root, 'dist/asset');

async function copyNowJson() {
  const srcFile = path.join(config.root, 'now.json');
  const distFile = path.join(config.root, 'dist/now.json');
  await fs.copy(srcFile, distFile);
}

module.exports = async function () {
  await fs.copy(srcDir, distDir);
  await copyNowJson();
}

