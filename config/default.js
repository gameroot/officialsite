const path = require('path');
const pkg = require('../package.json');

module.exports = {
  pkgName: pkg.name,
  version: pkg.version,

  devServer: {
    host: 'localhost',
    port: 3000
  },

  root: path.join(__dirname, '../'),

  libs: {
    js: [
      'jquery/dist/jquery.js'
    ],
    css: []
  },

  bundleAlias: {
    jquery: 'jQuery'
  }
};
