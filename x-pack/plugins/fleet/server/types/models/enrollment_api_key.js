"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EnrollmentAPIKeySchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const EnrollmentAPIKeySchema = _configSchema.schema.object({
  id: _configSchema.schema.string(),
  api_key_id: _configSchema.schema.string(),
  api_key: _configSchema.schema.string(),
  name: _configSchema.schema.maybe(_configSchema.schema.string()),
  active: _configSchema.schema.boolean(),
  policy_id: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.EnrollmentAPIKeySchema = EnrollmentAPIKeySchema;