"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templateSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const templateSchema = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  indexPatterns: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  version: _configSchema.schema.maybe(_configSchema.schema.number()),
  order: _configSchema.schema.maybe(_configSchema.schema.number()),
  priority: _configSchema.schema.maybe(_configSchema.schema.number()),
  template: _configSchema.schema.maybe(_configSchema.schema.object({
    settings: _configSchema.schema.maybe(_configSchema.schema.object({}, {
      unknowns: 'allow'
    })),
    aliases: _configSchema.schema.maybe(_configSchema.schema.object({}, {
      unknowns: 'allow'
    })),
    mappings: _configSchema.schema.maybe(_configSchema.schema.object({}, {
      unknowns: 'allow'
    }))
  })),
  composedOf: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  dataStream: _configSchema.schema.maybe(_configSchema.schema.object({
    hidden: _configSchema.schema.maybe(_configSchema.schema.boolean())
  }, {
    unknowns: 'allow'
  })),
  _meta: _configSchema.schema.maybe(_configSchema.schema.object({}, {
    unknowns: 'allow'
  })),
  ilmPolicy: _configSchema.schema.maybe(_configSchema.schema.object({
    name: _configSchema.schema.maybe(_configSchema.schema.string()),
    rollover_alias: _configSchema.schema.maybe(_configSchema.schema.string())
  })),
  _kbnMeta: _configSchema.schema.object({
    type: _configSchema.schema.string(),
    hasDatastream: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    isLegacy: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })
});

exports.templateSchema = templateSchema;