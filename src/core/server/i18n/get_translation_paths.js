"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTranslationPaths = getTranslationPaths;

var _path = require("path");

var _globby = _interopRequireDefault(require("globby"));

var _fs = require("./fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const I18N_RC = '.i18nrc.json';

async function getTranslationPaths({
  cwd,
  nested
}) {
  const glob = nested ? `*/${I18N_RC}` : I18N_RC;
  const entries = await (0, _globby.default)(glob, {
    cwd
  });
  const translationPaths = [];

  for (const entry of entries) {
    const entryFullPath = (0, _path.resolve)(cwd, entry);
    const pluginBasePath = (0, _path.dirname)(entryFullPath);

    try {
      const content = await (0, _fs.readFile)(entryFullPath, 'utf8');
      const {
        translations
      } = JSON.parse(content);

      if (translations && translations.length) {
        translations.forEach(translation => {
          const translationFullPath = (0, _path.resolve)(pluginBasePath, translation);
          translationPaths.push(translationFullPath);
        });
      }
    } catch (err) {
      throw new Error(`Failed to parse .i18nrc.json file at ${entryFullPath}`);
    }
  }

  return translationPaths;
}