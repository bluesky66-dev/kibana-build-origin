"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomElementUpdateSchema = exports.CustomElementSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const CustomElementSchema = _configSchema.schema.object({
  '@created': _configSchema.schema.maybe(_configSchema.schema.string()),
  '@timestamp': _configSchema.schema.maybe(_configSchema.schema.string()),
  content: _configSchema.schema.string(),
  displayName: _configSchema.schema.string(),
  help: _configSchema.schema.maybe(_configSchema.schema.string()),
  id: _configSchema.schema.string(),
  image: _configSchema.schema.maybe(_configSchema.schema.string()),
  name: _configSchema.schema.string(),
  tags: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
});

exports.CustomElementSchema = CustomElementSchema;

const CustomElementUpdateSchema = _configSchema.schema.object({
  displayName: _configSchema.schema.string(),
  help: _configSchema.schema.maybe(_configSchema.schema.string()),
  image: _configSchema.schema.maybe(_configSchema.schema.string()),
  name: _configSchema.schema.string()
});

exports.CustomElementUpdateSchema = CustomElementUpdateSchema;