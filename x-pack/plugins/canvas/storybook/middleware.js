"use strict";

var _path = _interopRequireDefault(require("path"));

var _serveStatic = _interopRequireDefault(require("serve-static"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error
// Extend the Storybook Middleware to include a route to access Legacy UI assets


module.exports = function (router) {
  router.get('/ui', (0, _serveStatic.default)(_path.default.resolve(__dirname, '../../../../../src/core/server/core_app/assets')));
};