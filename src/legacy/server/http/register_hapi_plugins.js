"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerHapiPlugins = registerHapiPlugins;

var _vision = _interopRequireDefault(require("@hapi/vision"));

var _inert = _interopRequireDefault(require("@hapi/inert"));

var _h2o = _interopRequireDefault(require("@hapi/h2o2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const plugins = [_vision.default, _inert.default, _h2o.default];

async function registerPlugins(server) {
  return await server.register(plugins);
}

function registerHapiPlugins(server) {
  registerPlugins(server);
}