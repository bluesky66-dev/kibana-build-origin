"use strict";

var _storybook = require("@kbn/storybook");

var _webpack = _interopRequireDefault(require("@kbn/storybook/target/webpack.config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
module.exports = { ..._storybook.defaultConfig,
  addons: ['@storybook/addon-essentials'],
  webpackFinal: config => {
    return (0, _webpack.default)({
      config
    });
  }
};