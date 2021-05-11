"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = exports.config = void 0;

var _lodash = require("lodash");

var _config = require("../config");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  exposeToBrowser: {
    defaultAppId: true
  },
  schema: _config.configSchema,
  deprecations: ({
    renameFromRoot
  }) => [// TODO: Remove deprecation once defaultAppId is deleted
  renameFromRoot('kibana.defaultAppId', 'kibana_legacy.defaultAppId', true), (completeConfig, rootPath, log) => {
    if ((0, _lodash.get)(completeConfig, 'kibana.defaultAppId') === undefined && (0, _lodash.get)(completeConfig, 'kibana_legacy.defaultAppId') === undefined) {
      return completeConfig;
    }

    log(`kibana.defaultAppId is deprecated and will be removed in 8.0. Please use the \`defaultRoute\` advanced setting instead`);
    return completeConfig;
  }]
};
exports.config = config;

class Plugin {
  setup(core) {}

  start(core) {}

}

const plugin = () => new Plugin();

exports.plugin = plugin;