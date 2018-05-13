const pug = require('pug');
const path = require('path');
const config = require('config');
const fs = require('fs-extra');

const localeMap = require('./locale');
const renderFile = require('./renderModules');

const FilesMap = {
  cssFiles: [],
  jsFiles: []
};

function renderPage(page, FilesMap) {
  const stats = fs.statSync(path.join(config.root, 'client/views/pages', page));
  if (stats.isFile) {
    config.locales.forEach(locale => {
      let renderFilesMap = Object.assign({locale: localeMap[locale]}, FilesMap);
      const result = pug.compileFile(path.join(config.root, 'client/views/pages', page))(renderFilesMap);
      fs.ensureDirSync(path.join(config.root, '.tmp/pages', locale));
      fs.writeFileSync(path.join(config.root, '.tmp/pages', locale, page.replace('.pug', '.html')), result);
    });
  }
}

module.exports = async function (jsFileMap, cssFileMap) {
  const renderFileObj = await renderFile();

  if (renderFileObj.jsFile) {
    FilesMap.jsFiles.push(renderFileObj.jsFile);
  }

  if (renderFileObj.cssFile) {
    FilesMap.cssFiles.push(renderFileObj.cssFile);
  }

  FilesMap.cssFiles = FilesMap.cssFiles.concat(cssFileMap.baseFile);
  FilesMap.jsFiles = FilesMap.jsFiles.concat(jsFileMap.baseFile);
  FilesMap.pageJs = jsFileMap.pageFile || {};
  FilesMap.pageCss = cssFileMap.pageFile || {};

  console.log(FilesMap);

  const pages = fs.readdirSync(path.join(config.root, 'client/views/pages'));

  pages.forEach(page => renderPage(page, FilesMap));
}
