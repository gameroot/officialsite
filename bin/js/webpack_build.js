const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('config');

const loaderModuleDirs = [ path.join(__dirname, '../../node_modules') ];
const outputDir = path.join(__dirname, '../../dist/js');

const webpackConfig = {
  entry: path.join(__dirname, '../../client/js/base.js'),
  mode: 'production',
  output: {
    path: outputDir
  },
  cache: {},
  module: {
    rules: [{
      test: /\.html$/,
      use: 'raw-loader'
    }]
  },
  plugins: [],
  resolve: {
    alias: config.bundleAlias
  },
  resolveLoader: {
    modules: loaderModuleDirs
  },
  devtool: false
};

async function compile(compileConfig, outputName) {
  await fs.ensureDir(outputDir);
  compileConfig.output.filename = outputName + '.min.js';
  console.log('Start webpack packing', outputName, '...');
  
  await new Promise((resolve, reject) => {
    webpack(compileConfig, (err, stats) => {
      if (err) return reject(err);
      const info = stats.toJson();
      if (stats.hasErrors()) {
        reject(stats.compilation.errors);
      }
      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
      resolve();
    });
  });

  console.log('Generate JS', compileConfig.output.filename);
  return '/js/' + outputName + '.min.js';
}

module.exports = async function bundle(changedFile = null) {
  await fs.ensureDir(outputDir);

  // compile base js
  let file =  await compile(webpackConfig, 'main');

  // compile page js
  const pageFileMap = {};
  let pages = fs.readdirSync(path.join(config.root, 'client/js/pages'));
  if (pages && pages.length > 0) {
    for (let index = 0; index < pages.length; index ++) {
      const page = pages[index];
      const filePath = path.join(config.root, 'client/js/pages', page);
      const stats = fs.statSync(filePath);
      if (stats.isFile) {
        let fileWebpackConfig = Object.assign({}, webpackConfig, {
          entry: filePath
        });
        pageFileMap[page.replace('.js', '')] = await compile(fileWebpackConfig, page.replace('.js', ''));
      }
    }
  }

  return {
    baseFile: file,
    pageFile: pageFileMap
  };
};
