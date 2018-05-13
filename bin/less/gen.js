const less = require('less');
const path = require('path');
const fs = require('fs-extra');
const LessPluginCleanCSS = require('less-plugin-clean-css');
const config = require('config');

const outputDir = path.join(__dirname, '../../.tmp/css');

async function _render(file, outputName) {
  const result = await new Promise(resolve => {
    less.render(file, {
      paths: [ path.join(__dirname, '../../client/less') ],
      plugins: [],
      sourceMap: {
        sourceMapBasepath: path.join(__dirname, '../../client/less'),
        sourceMapURL: `${outputName}.css.map`
      }
    }).then(resolve, resolve);
  });

  console.log(result);
  if (!result.css) return result;
  

  fs.writeFileSync(path.join(outputDir, `${outputName}.css`), result.css);
  fs.writeFileSync(path.join(outputDir, `${outputName}.css.map`), result.map);

  return `/css/${outputName}.css`;
}

module.exports = async function compile(changedFile = null) {
  await fs.ensureDir(outputDir);

  // compile base file
  let file = await _render(`@import './index.less';`, 'main');

  // compile page file
  const pageFileMap = {};
  let pages = fs.readdirSync(path.join(config.root, 'client/less/pages'));
  if (pages && pages.length > 0) {
    pages.forEach(async (page) => {
      const filePath = path.join(config.root, 'client/less/pages', page);
      const stats = fs.statSync(filePath);
      if (stats.isFile) {
        pageFileMap[page.replace('.less', '')] = await _render(`@import './pages/${page}';`, page.replace('.less', ''));
      }
    });
  }
  return {
    baseFile: file,
    pageFile: pageFileMap
  };
  return [file];
};
