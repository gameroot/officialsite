const path = require('path');
const config = require('config');
const fs = require('fs-extra');

const outputDir = path.join(config.root, 'dist');

function render() {
  let jsFilename = 'render.min.js';
  let cssFilename = 'render.min.css';
  let result = {};
  let jsSrc = '';
  let cssSrc = '';
  config.libs.js.forEach(lib => {
    const content = fs.readFileSync(path.join(config.root, 'node_modules', lib), {encoding: 'utf-8'});
    jsSrc += `\n${content}`;
  });
  config.libs.css.forEach(lib => {
    const content = fs.readFileSync(path.join(config.root, 'node_modules', lib), {encoding: 'utf-8'});
    cssSrc += `\n${content}`;
  });


  if (jsSrc) {
    fs.writeFileSync(path.join(outputDir, 'js', jsFilename), jsSrc);
    result.jsFile = `/js/${jsFilename}`;
  }

  if (cssSrc) {
    fs.writeFileSync(path.join(outputDir, 'css', cssFilename), cssSrc);
    result.cssFile = `/css/${cssFilename}`;
  }

  return result;
}

module.exports = async function () {
  await fs.ensureDir(path.join(outputDir, 'js'));
  await fs.ensureDir(path.join(outputDir, 'css'));  

  return render();
}
