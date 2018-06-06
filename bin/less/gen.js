const less = require('less');
const path = require('path');
const fs = require('fs-extra');
const config = require('config');
require('colors');

const outputDir = path.join(__dirname, '../../.tmp/css');

async function _render(file, outputName) {
  // const fileManagers = less.environment && less.environment.fileManagers || [];
  // fileManagers.forEach(fileManager => {
  //   if (fileManager.contents) {
  //     fileManager.contents = {};
  //   }
  // });
  let result;
  try {
    result = await new Promise((resolve, reject) => {
      less.render(file, {
        paths: [ path.join(config.root, 'client/less') ],
        plugins: [],
        sourceMap: {
          sourceMapBasepath: path.join(__dirname, '../../client/less'),
          sourceMapURL: `${outputName}.css.map`
        }
      }).then(resolve, resolve);
    });
  } catch(err) {
    console.error(err);
  }

  if (!result.css) return `/css/${outputName}.css`;
  fs.writeFileSync(path.join(outputDir, `${outputName}.css`), result.css);
  console.log('wirte file', `${outputName}.css`.yellow);
  fs.writeFileSync(path.join(outputDir, `${outputName}.css.map`), result.map);
  console.log('wirte file', `${outputName}.css.map`.yellow);


  return `/css/${outputName}.css`;
}

module.exports = async function compile(changedFile = null) {
  console.log('start gen css');
  await fs.ensureDir(outputDir);

  // compile base file
  let file = await _render(`@import './index.less';`, 'main');

  // compile page file
  const pageFileMap = {};
  let pages = fs.readdirSync(path.join(config.root, 'client/less/pages'));
  if (pages && pages.length > 0) {
    for (let index = 0; index < pages.length; index++) {
      const page = pages[index];
      const filePath = path.join(config.root, 'client/less/pages', page);
      const stats = fs.statSync(filePath);
      if (stats.isFile) {
        pageFileMap[page.replace('.less', '')] = await _render(`@import './pages/${page}';`, page.replace('.less', ''));
      }
    }
  }
  return {
    baseFile: file,
    pageFile: pageFileMap
  };
};
