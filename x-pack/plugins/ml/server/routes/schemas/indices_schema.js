"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indicesSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const indicesSchema = _configSchema.schema.object({
  index: _configSchema.schema.maybe(_configSchema.schema.string()),
  fields: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
});

exports.indicesSchema = indicesSchema;