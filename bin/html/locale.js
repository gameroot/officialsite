const path = require('path');
const config = require('config');
const fs = require('fs-extra');

const i18n = {};
const localesDir = path.join(config.root, 'client/locales');

config.locales.forEach(locale => {
  i18n[locale] = {};
  const dirList = fs.readdirSync(path.join(localesDir, locale));
  if (!dirList || dirList.length === 0) {
    return ;
  }

  dirList.forEach(dir => {
    if (path.extname(dir) !== '.json' && path.extname(dir) !== '.js') {
      return ;
    }
    if (dir === '_.json') {
      // i18n[locale]._global = fs.readJsonSync(path.join(localesDir, locale, dir));
      i18n[locale]._global = require(path.join(localesDir, locale, dir));
    } else {
      // i18n[locale][dir.replace('.json', '')] = fs.readJsonSync(path.join(localesDir, locale, dir));
      i18n[locale][dir.replace('.json', '').replace('.js', '')] = require(path.join(localesDir, locale, dir));
    }
  });
});

module.exports = i18n;