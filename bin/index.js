#!/usr/bin/env node

const map = {
  dev: 'dev.js',
  build: 'build.js',
  // less: 'css/gen.js',
  // js: 'js/webpack.js',
  // html: 'html/gen.js',
  // lint: 'lint/lint.js'
};

function _exit(err) {
  if (err) console.error(err);
  process.exit(err ? -1 : 0);
}
process.on('uncaughtException', _exit);

const cmd = process.argv[2];
if (!map.hasOwnProperty(cmd)) {
  console.error('Unknown command.');
  process.exit(-1);
}

try {
  require(`./${map[cmd]}`)().catch(_exit);  
} catch(ex) {
  _exit(ex);
}
