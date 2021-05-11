"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseMilliseconds = parseMilliseconds;
exports.parse = parse;

var _path = require("path");

var _expiryJs = _interopRequireDefault(require("expiry-js"));

var _utils = require("../../core/server/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function generateUrls({
  version,
  plugin
}) {
  return [plugin, `https://artifacts.elastic.co/downloads/kibana-plugins/${plugin}/${plugin}-${version}.zip`];
}

function parseMilliseconds(val) {
  let result;

  try {
    const timeVal = (0, _expiryJs.default)(val);
    result = timeVal.asMilliseconds();
  } catch (ex) {
    result = 0;
  }

  return result;
}

function parse(command, options, kbnPackage) {
  const settings = {
    timeout: options.timeout || 0,
    quiet: options.quiet || false,
    silent: options.silent || false,
    config: options.config || '',
    plugin: command,
    version: kbnPackage.version,
    pluginDir: (0, _utils.fromRoot)('plugins')
  };
  settings.urls = generateUrls(settings);
  settings.workingPath = (0, _path.resolve)(settings.pluginDir, '.plugin.installing');
  settings.tempArchiveFile = (0, _path.resolve)(settings.workingPath, 'archive.part');
  return settings;
}