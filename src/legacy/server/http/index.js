"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _url = require("url");

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _register_hapi_plugins = require("./register_hapi_plugins");

var _setup_base_path_provider = require("./setup_base_path_provider");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function _default(kbnServer, server) {
  server = kbnServer.server;
  (0, _setup_base_path_provider.setupBasePathProvider)(kbnServer);
  await (0, _register_hapi_plugins.registerHapiPlugins)(server);
  server.route({
    method: 'GET',
    path: '/{p*}',
    handler: function (req, h) {
      const path = req.path;

      if (path === '/' || path.charAt(path.length - 1) !== '/' || path.charAt(0) === '/') {
        throw _boom.default.notFound();
      }

      const pathPrefix = req.getBasePath() ? `${req.getBasePath()}/` : '';
      return h.redirect((0, _url.format)({
        search: req.url.search,
        pathname: pathPrefix + path.slice(0, -1)
      })).permanent(true);
    }
  });
}

module.exports = exports.default;