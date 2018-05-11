const path = require('path');
const config = require('config');
const fs = require('fs-extra');

const outputDir = path.join(config.root, '.tmp/js');

function render() {
  let jsFilename = 'render.js';
  let cssFilename = 'render.css';
  let result = {};
  let jsSrc = '';
  let cssSrc = '';
  config.libs.js.forEach(lib => {
    const content = fs.readFileSync(path.join(config.root, 'node_modules', lib));
    jsSrc += `\n${content}`;
  });
  config.libs.css.forEach(lib => {
    const content = fs.readFileSync(path.join(config.root, 'node_modules', lib));
    cssSrc += `\n${content}`;
  });

  if (jsSrc) {
    fs.writeFileSync(path.join(outputDir, jsFilename), jsSrc);
    result.jsFile = `js/${jsFilename}`;
  }

  if (cssSrc) {
    fs.writeFileSync(path.join(outputDir, jsFilename), cssSrc);
    result.cssFile = `css/${cssFilename}`;
  }

  return result;
}

module.exports = async function () {
  await fs.ensureDir(outputDir);

  return render();
}
