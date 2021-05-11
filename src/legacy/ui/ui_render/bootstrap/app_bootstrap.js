"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppBootstrap = void 0;

var _handlebars = _interopRequireDefault(require("handlebars"));

var _crypto = require("crypto");

var _fs = require("fs");

var _path = require("path");

var _kbn_bundles_loader_source = require("./kbn_bundles_loader_source");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class AppBootstrap {
  constructor({
    templateData
  }) {
    this.templateData = { ...templateData,
      kbnBundlesLoaderSource: _kbn_bundles_loader_source.kbnBundlesLoaderSource
    };
    this._rawTemplate = undefined;
  }

  async getJsFile() {
    if (!this._rawTemplate) {
      this._rawTemplate = await loadRawTemplate();
    }

    const template = _handlebars.default.compile(this._rawTemplate, {
      knownHelpersOnly: true,
      noEscape: true,
      // this is a js file, so html escaping isn't appropriate
      strict: true
    });

    return template(this.templateData);
  }

  async getJsFileHash() {
    const fileContents = await this.getJsFile();
    const hash = (0, _crypto.createHash)('sha1');
    hash.update(fileContents);
    return hash.digest('hex');
  }

}

exports.AppBootstrap = AppBootstrap;

function loadRawTemplate() {
  const templatePath = (0, _path.resolve)(__dirname, 'template.js.hbs');
  return readFileAsync(templatePath);
}

function readFileAsync(filePath) {
  return new Promise((resolve, reject) => {
    (0, _fs.readFile)(filePath, 'utf8', (err, fileContents) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(fileContents);
    });
  });
}