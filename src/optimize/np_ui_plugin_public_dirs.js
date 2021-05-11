"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNpUiPluginPublicDirs = getNpUiPluginPublicDirs;
exports.isNpUiPluginPublicDirs = isNpUiPluginPublicDirs;
exports.assertIsNpUiPluginPublicDirs = assertIsNpUiPluginPublicDirs;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getNpUiPluginPublicDirs(kbnServer) {
  return Array.from(kbnServer.newPlatform.__internals.uiPlugins.internal.entries()).map(([id, {
    publicTargetDir
  }]) => ({
    id,
    path: publicTargetDir
  }));
}

function isNpUiPluginPublicDirs(x) {
  return Array.isArray(x) && x.every(s => typeof s === 'object' && s && typeof s.id === 'string' && typeof s.path === 'string');
}

function assertIsNpUiPluginPublicDirs(x) {
  if (!isNpUiPluginPublicDirs(x)) {
    throw new TypeError('npUiPluginPublicDirs must be an array of objects with string `id` and `path` properties');
  }
}