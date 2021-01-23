'use strict';

/**
 * @file The main webpack config, responsible
 * for retrieving the environment context and
 * generating a config.
 */

const path = require('path');
const webpack = require('webpack');
const {merge} = require('webpack-merge');
const commonConfig = require('./webpack/webpack.common');

const addonsConfigRoot = path.join(__dirname, 'webpack', 'addons');

const getAddons = (addons) => {
  if (addons == null) {
    return [];
  }

  return addons.split(',').map((addon) => {
    const trimmed = addon.trim();
    return require(path.join(addonsConfigRoot, `webpack.${trimmed}.js`));
  });
};

const getConfigByEnv = (env) => {
  let config = () => {};

  try {
    config = require(path.join(__dirname, 'webpack', `webpack.${env}.js`));
  } catch (ex) {
    throw new Error(ex);
  }

  return config;
};

module.exports = async ({NODE_ENV, NODE_ADDONS, ...webpackOpts }) => {
  let addonsConfig = [];

  if (typeof NODE_ADDONS !== undefined) {
    addonsConfig = getAddons(NODE_ADDONS);
  }

  const common = commonConfig(webpackOpts);

  const webpackConfig = await getConfigByEnv(NODE_ENV)({ NODE_ENV, ...webpackOpts });

  return merge(common, webpackConfig, ...addonsConfig);
};
