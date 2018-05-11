const less = require('less');
const path = require('path');
const fs = require('fs-extra');
const LessPluginCleanCSS = require('less-plugin-clean-css');

const outputDir = path.join(__dirname, '../../.tmp/css');

async function _render() {
  const result = await new Promise(resolve => {
    less.render(`@import './index.less';`, {
      paths: [ path.join(__dirname, '../../client/less') ],
      plugins: [],
      sourceMap: {
        sourceMapBasepath: path.join(__dirname, '../../client/less'),
        sourceMapURL: `main.css.map`
      }
    }).then(resolve, resolve);
  });

  console.log(result);
  if (!result.css) return result;
  

  fs.writeFileSync(path.join(outputDir, 'main.css'), result.css);
  fs.writeFileSync(path.join(outputDir, 'main.css.map'), result.map);

  return null;
}

const files = { entry: null, main: null };

module.exports = async function compile(changedFile = null) {
  await fs.ensureDir(outputDir);

  await _render();
  return files;
};
