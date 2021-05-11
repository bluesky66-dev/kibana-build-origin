"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PutSettingsRequestSchema = exports.GetSettingsRequestSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const GetSettingsRequestSchema = {};
exports.GetSettingsRequestSchema = GetSettingsRequestSchema;
const PutSettingsRequestSchema = {
  body: _configSchema.schema.object({
    agent_auto_upgrade: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    package_auto_upgrade: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    kibana_urls: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.uri({
      scheme: ['http', 'https']
    }), {
      validate: value => {
        if ((0, _common.isDiffPathProtocol)(value)) {
          return 'Protocol and path must be the same for each URL';
        }
      }
    })),
    kibana_ca_sha256: _configSchema.schema.maybe(_configSchema.schema.string()),
    has_seen_add_data_notice: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    additional_yaml_config: _configSchema.schema.maybe(_configSchema.schema.string())
  })
};
exports.PutSettingsRequestSchema = PutSettingsRequestSchema;