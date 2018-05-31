const WSServer = require('ws').Server;
const path = require('path');
const watcher = require('chokidar');
const config = require('config');
const ip = require('ip');
const genCss = require('./less/gen_build');
const genJs = require('./js/webpack_build');
const genHtml = require('./html/gen_build');
const genAsset = require('./asset/gen');

async function gen() {
  return Promise.all([
    genJs(),
    genCss()
  ]);
}

async function build() {
  console.log(`build app`);

  const results = await gen();

  await genHtml(...results);
  await genAsset();
}

module.exports = build;
