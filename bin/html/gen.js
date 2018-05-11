const pug = require('pug');
const path = require('path');
const config = require('config');
const fs = require('fs-extra');

const renderFile = require('./renderModules');

const FilesMap = {
  cssFiles: [],
  jsFiles: []
};

const pages = fs.readdirSync(path.join(config.root, 'client/views/pages'));

pages.forEach(page => {
  const stats = fs.statSync(path.join(config.root, 'client/views/pages', page));
  if (stats.isFile) {
    const result = pug.compileFile(path.join(config.root, 'client/views/pages', page))(FilesMap);
    fs.writeFileSync(path.join(config.root, '.tmp/pages', page.replace('.pug', '.html')), result);
  }
});

module.exports = async function (jsFiles, cssFiles) {
  const renderFileObj = renderFile();

  if (renderFileObj.jsFile) {
    FilesMap.jsFiles.push(renderFileObj.jsFile);
  }

  if (renderFileObj.cssFile) {
    FilesMap.cssFiles.push(renderFileObj.cssFile);
  }

  FilesMap.cssFiles = FilesMap.cssFiles.concat(cssFiles);
  FilesMap.jsFiles = FilesMap.jsFiles.concat(jsFiles);
}
