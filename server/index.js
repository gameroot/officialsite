const Koa = require('koa');
const static = require('koa-static');
const mount = require('koa-mount');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const views = require('koa-views');
const fs = require('fs-extra');
const path = require('path');
const http = require('http');
const WSServer = require('ws').Server;
const config = require('config');
const routes = require('./router');

const app = new Koa();
const liveReloadClients = [];

app.use(views(path.join(__dirname, '../.tmp/pages')));
app.use(logger());
app.use(koaBody());


app.use(mount('/js', static(path.join(__dirname, '../.tmp/js'))));
app.use(mount('/css', static(path.join(__dirname, '../.tmp/css'))));
app.use(mount('/asset', static(path.join(__dirname, '../client/asset'))));

app.use(routes);

module.exports = function () {
  const server = http.createServer(app.callback());
  
  function reload() {
    console.log('Page reload.');
    liveReloadClients.forEach(ws => {
      try {
        ws.send('reload');
      } catch(ex) {
        console.log(ex);
      }
    });
  }
  
  function initLiveReload(server) {
    const wServer = new WSServer({
      server,
    });
    wServer.on('connection',  ws => {
      liveReloadClients.push(ws);
      ws.on('close', _des);
      ws.on('error', _des);
      function _des(err) {
        if (typeof err === 'object' && err && err.code !== 'ECONNRESET') {
          console.log(err);
        }
        const idx = liveReloadClients.indexOf(ws);
        idx >= 0 && liveReloadClients.splice(idx, 1);
        ws.removeListener('close', _des);
        ws.removeListener('error', _des);
      }
    });
  }

  server.listen(config.devServer.port, config.devServer.host, () => {
    console.log(`server listen to ${config.devServer.host}:${config.devServer.port}`);
  });

  initLiveReload(server);

  server.reload = reload;

  return server;
}
