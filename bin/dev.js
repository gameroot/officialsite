const WSServer = require('ws').Server;
const path = require('path');
const watcher = require('chokidar');
const config = require('config');
const ip = require('ip');
const genCss = require('./less/gen');
const genJs = require('./js/webpack');
const genHtml = require('./html/gen');
const createDevServer = require('../server/index');

const cacheFiles = [];

async function gen() {
  return Promise.all([
    genJs(),
    genCss()
  ]);
}

async function dev() {
  console.log(`web app running`);

  const results = await gen();

  cacheFiles.push(...results);
  await genHtml(...results);
  const server = await createDevServer();

  watch(path.join(config.root, 'client'), onSrcFileChange);    
  watch(path.join(config.root, '.tmp'), onTmpFileChange);

  let changeBusy = false;

  function onSrcFileChange(file) {
    if (changeBusy) return;
    (async function () {
      changeBusy = true;
      const ext = path.extname(file);
      console.log(ext);
      if ('.htm' === ext || '.pug' === ext) {
        await genHtml(...cacheFiles);
      } else if ('.less' === ext) {
        cacheFiles[1] = await genCss(file);
      } else if (['.js', '.html'].indexOf(ext) >= 0) {
        cacheFiles[0] = await genJs(file);
      }

      changeBusy = false;
    })().catch(err => {
      console.log(err);
      changeBusy = false;
    });
  }

  function onTmpFileChange(file) {
    if (!/\.(js|css|html)$/.test(file)) return;
    server && server.reload();
  }

  function watch(dir, handler) {
    watcher.watch(dir, { ignoreInitial: true })
      .on('add', handler)
      .on('change', handler)
      .on('unlink', handler);
  }

}

module.exports = dev;
