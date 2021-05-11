"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = exports.config = void 0;

var _config = require("../config");

var _usage_collector = require("./usage_collector");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  exposeToBrowser: {
    legacyVisEnabled: true
  },
  schema: _config.configSchema,
  deprecations: ({
    renameFromRoot
  }) => [renameFromRoot('table_vis.enabled', 'vis_type_table.enabled')]
};
exports.config = config;

const plugin = () => ({
  setup(core, plugins) {
    if (plugins.usageCollection) {
      (0, _usage_collector.registerVisTypeTableUsageCollector)(plugins.usageCollection);
    }
  },

  start() {}

});

exports.plugin = plugin;