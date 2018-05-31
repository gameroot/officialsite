const fs = require('fs-extra');
const path = require('path');
const config = require('config');

const srcDir = path.join(config.root, 'client/asset');
const distDir = path.join(config.root, 'dist/asset');


module.exports = async function () {
  await fs.copy(srcDir, distDir);
}

