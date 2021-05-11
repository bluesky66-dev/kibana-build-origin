"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const deprecations = () => [(settings, fromPath, log) => {
  const kibana = settings[fromPath];

  if (kibana !== null && kibana !== void 0 && kibana.index) {
    log(`"kibana.index" is deprecated. Multitenancy by changing "kibana.index" will not be supported starting in 8.0. See https://ela.st/kbn-remove-legacy-multitenancy for more details`);
  }

  return settings;
}];

const config = {
  path: 'kibana',
  schema: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    index: _configSchema.schema.string({
      defaultValue: '.kibana'
    }),
    autocompleteTerminateAfter: _configSchema.schema.duration({
      defaultValue: 100000
    }),
    autocompleteTimeout: _configSchema.schema.duration({
      defaultValue: 1000
    })
  }),
  deprecations
};
exports.config = config;