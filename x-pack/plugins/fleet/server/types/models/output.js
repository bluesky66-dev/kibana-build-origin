"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OutputSchema = exports.NewOutputSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const OutputBaseSchema = {
  name: _configSchema.schema.string(),
  type: _configSchema.schema.oneOf([_configSchema.schema.literal(_constants.outputType.Elasticsearch)]),
  hosts: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  api_key: _configSchema.schema.maybe(_configSchema.schema.string()),
  fleet_enroll_username: _configSchema.schema.maybe(_configSchema.schema.string()),
  fleet_enroll_password: _configSchema.schema.maybe(_configSchema.schema.string()),
  config: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any())),
  config_yaml: _configSchema.schema.maybe(_configSchema.schema.string())
};

const NewOutputSchema = _configSchema.schema.object({ ...OutputBaseSchema
});

exports.NewOutputSchema = NewOutputSchema;

const OutputSchema = _configSchema.schema.object({ ...OutputBaseSchema,
  id: _configSchema.schema.string()
});

exports.OutputSchema = OutputSchema;