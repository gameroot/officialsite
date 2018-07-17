const path = require('path');
const pkg = require('../package.json');

module.exports = {
  pkgName: pkg.name,
  version: pkg.version,

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  locales: [
    'zh_cn',
    'en'
  ],

  defaultLocale: 'en',

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
  },

  // 页面渲染所用的变量

  renderOption: {
    twitter: {
      link: 'https://twitter.com/GameRootEx'
    },
    github: {
      link: 'https://github.com/gameroot'
    },
    facebook: {
      link: 'https://www.facebook.com/Game-Root-509842282752394/'
    },
    telegram: {
      link: 'https://t.me/GamerootExchange'
    },
    mailchimp: {
      subscribeUrl: 'https://gameroot.us18.list-manage.com/subscribe/post?u=374f150861abde04549e845f0&amp;id=a8aa5f5051'
    }
  }
};
