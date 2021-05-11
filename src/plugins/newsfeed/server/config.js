"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../common/constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const configSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  service: _configSchema.schema.object({
    pathTemplate: _configSchema.schema.string({
      defaultValue: _constants.NEWSFEED_DEFAULT_SERVICE_PATH
    }),
    urlRoot: _configSchema.schema.conditional(_configSchema.schema.contextRef('prod'), _configSchema.schema.literal(true), // Point to staging if it's not a production release
    _configSchema.schema.string({
      defaultValue: _constants.NEWSFEED_DEFAULT_SERVICE_BASE_URL
    }), _configSchema.schema.string({
      defaultValue: _constants.NEWSFEED_DEV_SERVICE_BASE_URL
    }))
  }),
  defaultLanguage: _configSchema.schema.string({
    defaultValue: _constants.NEWSFEED_FALLBACK_LANGUAGE
  }),
  // TODO: Deprecate since no longer used
  mainInterval: _configSchema.schema.duration({
    defaultValue: '2m'
  }),
  // (2min) How often to retry failed fetches, and/or check if newsfeed items need to be refreshed from remote
  fetchInterval: _configSchema.schema.duration({
    defaultValue: '1d'
  }) // (1day) How often to fetch remote and reset the last fetched time

});

exports.configSchema = configSchema;