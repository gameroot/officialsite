const path = require('path');
const pkg = require('../package.json');

module.exports = {
  pkgName: pkg.name,
  version: pkg.version,

  devServer: {
    host: 'localhost',
    port: 3000
  },

  locales: [
    'en', 'zh_cn'
  ],

  defaultLocale: 'zh_cn',

  root: path.join(__dirname, '../'),

  libs: {
    js: [
      'jquery/dist/jquery.js',
      'bootstrap/dist/js/bootstrap.min.js'
    ],
    css: [
      'bootstrap/dist/css/bootstrap.min.css'
    ]
  },

  bundleAlias: {
    jquery: 'jQuery'
  }
};
