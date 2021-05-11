"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _utils = require("@kbn/utils");

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
  allowChangingOptInStatus: _configSchema.schema.boolean({
    defaultValue: true
  }),
  optIn: _configSchema.schema.conditional(_configSchema.schema.siblingRef('allowChangingOptInStatus'), _configSchema.schema.literal(false), _configSchema.schema.maybe(_configSchema.schema.literal(true)), _configSchema.schema.boolean({
    defaultValue: true
  }), {
    defaultValue: true
  }),
  // `config` is used internally and not intended to be set
  config: _configSchema.schema.string({
    defaultValue: (0, _utils.getConfigPath)()
  }),
  banner: _configSchema.schema.boolean({
    defaultValue: true
  }),
  url: _configSchema.schema.conditional(_configSchema.schema.contextRef('dist'), _configSchema.schema.literal(false), // Point to staging if it's not a distributable release
  _configSchema.schema.string({
    defaultValue: `https://telemetry-staging.elastic.co/xpack/${_constants.ENDPOINT_VERSION}/send`
  }), _configSchema.schema.string({
    defaultValue: `https://telemetry.elastic.co/xpack/${_constants.ENDPOINT_VERSION}/send`
  })),
  optInStatusUrl: _configSchema.schema.conditional(_configSchema.schema.contextRef('dist'), _configSchema.schema.literal(false), // Point to staging if it's not a distributable release
  _configSchema.schema.string({
    defaultValue: `https://telemetry-staging.elastic.co/opt_in_status/${_constants.ENDPOINT_VERSION}/send`
  }), _configSchema.schema.string({
    defaultValue: `https://telemetry.elastic.co/opt_in_status/${_constants.ENDPOINT_VERSION}/send`
  })),
  sendUsageFrom: _configSchema.schema.oneOf([_configSchema.schema.literal('server'), _configSchema.schema.literal('browser')], {
    defaultValue: 'server'
  })
});

exports.configSchema = configSchema;