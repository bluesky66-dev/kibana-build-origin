"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configSchema = void 0;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const configSchema = _configSchema.schema.object({
  autocomplete: _configSchema.schema.object({
    querySuggestions: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      })
    }),
    valueSuggestions: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      })
    })
  }),
  search: _configSchema.schema.object({
    aggs: _configSchema.schema.object({
      shardDelay: _configSchema.schema.object({
        // Whether or not to register the shard_delay (which is only available in snapshot versions
        // of Elasticsearch) agg type/expression function to make it available in the UI for either
        // functional or manual testing
        enabled: _configSchema.schema.boolean({
          defaultValue: false
        })
      })
    })
  })
});

exports.configSchema = configSchema;