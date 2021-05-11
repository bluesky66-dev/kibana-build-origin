"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.componentTemplateSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const componentTemplateSchema = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  template: _configSchema.schema.object({
    settings: _configSchema.schema.maybe(_configSchema.schema.object({}, {
      unknowns: 'allow'
    })),
    aliases: _configSchema.schema.maybe(_configSchema.schema.object({}, {
      unknowns: 'allow'
    })),
    mappings: _configSchema.schema.maybe(_configSchema.schema.object({}, {
      unknowns: 'allow'
    }))
  }),
  version: _configSchema.schema.maybe(_configSchema.schema.number()),
  _meta: _configSchema.schema.maybe(_configSchema.schema.object({}, {
    unknowns: 'allow'
  })),
  _kbnMeta: _configSchema.schema.object({
    usedBy: _configSchema.schema.arrayOf(_configSchema.schema.string()),
    isManaged: _configSchema.schema.boolean()
  })
});

exports.componentTemplateSchema = componentTemplateSchema;