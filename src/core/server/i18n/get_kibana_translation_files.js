"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKibanaTranslationFiles = void 0;

var _path = require("path");

var _utils = require("../utils");

var _get_translation_paths = require("./get_translation_paths");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getKibanaTranslationFiles = async (locale, pluginPaths) => {
  const translationPaths = await Promise.all([(0, _get_translation_paths.getTranslationPaths)({
    cwd: (0, _utils.fromRoot)('.'),
    nested: true
  }), ...pluginPaths.map(pluginPath => (0, _get_translation_paths.getTranslationPaths)({
    cwd: pluginPath,
    nested: false
  })), (0, _get_translation_paths.getTranslationPaths)({
    cwd: (0, _utils.fromRoot)('../kibana-extra'),
    nested: true
  })]);
  return [].concat(...translationPaths).filter(translationPath => (0, _path.basename)(translationPath, '.json') === locale);
};

exports.getKibanaTranslationFiles = getKibanaTranslationFiles;