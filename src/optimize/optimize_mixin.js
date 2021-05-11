"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optimizeMixin = void 0;

var _bundles_route = require("./bundles_route");

var _np_ui_plugin_public_dirs = require("./np_ui_plugin_public_dirs");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const optimizeMixin = async (kbnServer, server, config) => {
  server.route((0, _bundles_route.createBundlesRoute)({
    basePublicPath: config.get('server.basePath'),
    npUiPluginPublicDirs: (0, _np_ui_plugin_public_dirs.getNpUiPluginPublicDirs)(kbnServer),
    buildHash: kbnServer.newPlatform.env.packageInfo.buildNum.toString(),
    isDist: kbnServer.newPlatform.env.packageInfo.dist
  }));
};

exports.optimizeMixin = optimizeMixin;