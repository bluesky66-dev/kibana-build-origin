"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = list;

var _fs = require("fs");

var _path = require("path");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function list(pluginDir, logger) {
  (0, _fs.readdirSync)(pluginDir).forEach(name => {
    const stat = (0, _fs.statSync)((0, _path.join)(pluginDir, name));

    if (stat.isDirectory() && name[0] !== '.') {
      try {
        const packagePath = (0, _path.join)(pluginDir, name, 'kibana.json');
        const pkg = JSON.parse((0, _fs.readFileSync)(packagePath, 'utf8'));
        logger.log(pkg.id + '@' + pkg.version);
      } catch (e) {
        throw new Error('Unable to read kibana.json file for plugin ' + name);
      }
    }
  });
  logger.log(''); //intentional blank line for aesthetics
}