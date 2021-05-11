"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InstallScriptRequestSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const InstallScriptRequestSchema = {
  params: _configSchema.schema.object({
    osType: _configSchema.schema.oneOf([_configSchema.schema.literal('macos'), _configSchema.schema.literal('linux')])
  })
};
exports.InstallScriptRequestSchema = InstallScriptRequestSchema;