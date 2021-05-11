"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fieldSpecSchema = exports.fieldSpecSchemaFields = exports.serializedFieldFormatSchema = void 0;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const serializedFieldFormatSchema = _configSchema.schema.object({
  id: _configSchema.schema.maybe(_configSchema.schema.string()),
  params: _configSchema.schema.maybe(_configSchema.schema.any())
});

exports.serializedFieldFormatSchema = serializedFieldFormatSchema;
const fieldSpecSchemaFields = {
  name: _configSchema.schema.string({
    maxLength: 1_000
  }),
  type: _configSchema.schema.string({
    defaultValue: 'string',
    maxLength: 1_000
  }),
  count: _configSchema.schema.maybe(_configSchema.schema.number({
    min: 0
  })),
  script: _configSchema.schema.maybe(_configSchema.schema.string({
    maxLength: 1_000_000
  })),
  format: _configSchema.schema.maybe(serializedFieldFormatSchema),
  esTypes: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  scripted: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  subType: _configSchema.schema.maybe(_configSchema.schema.object({
    multi: _configSchema.schema.maybe(_configSchema.schema.object({
      parent: _configSchema.schema.string()
    })),
    nested: _configSchema.schema.maybe(_configSchema.schema.object({
      path: _configSchema.schema.string()
    }))
  })),
  customLabel: _configSchema.schema.maybe(_configSchema.schema.string()),
  shortDotsEnable: _configSchema.schema.maybe(_configSchema.schema.boolean())
};
exports.fieldSpecSchemaFields = fieldSpecSchemaFields;

const fieldSpecSchema = _configSchema.schema.object(fieldSpecSchemaFields);

exports.fieldSpecSchema = fieldSpecSchema;