"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkpadSchema = exports.WorkpadVariable = exports.WorkpadAssetSchema = exports.WorkpadPageSchema = exports.WorkpadElementSchema = exports.PositionSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const PositionSchema = _configSchema.schema.object({
  angle: _configSchema.schema.number(),
  height: _configSchema.schema.number(),
  left: _configSchema.schema.number(),
  parent: _configSchema.schema.nullable(_configSchema.schema.string()),
  top: _configSchema.schema.number(),
  width: _configSchema.schema.number()
});

exports.PositionSchema = PositionSchema;

const WorkpadElementSchema = _configSchema.schema.object({
  expression: _configSchema.schema.string(),
  filter: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.string())),
  id: _configSchema.schema.string(),
  position: PositionSchema
});

exports.WorkpadElementSchema = WorkpadElementSchema;

const WorkpadPageSchema = _configSchema.schema.object({
  elements: _configSchema.schema.arrayOf(WorkpadElementSchema),
  groups: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
    id: _configSchema.schema.string(),
    position: PositionSchema
  }))),
  id: _configSchema.schema.string(),
  style: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.string()),
  transition: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.object({}), _configSchema.schema.object({
    name: _configSchema.schema.string()
  })]))
});

exports.WorkpadPageSchema = WorkpadPageSchema;

const WorkpadAssetSchema = _configSchema.schema.object({
  '@created': _configSchema.schema.string(),
  id: _configSchema.schema.string(),
  type: _configSchema.schema.string(),
  value: _configSchema.schema.string()
});

exports.WorkpadAssetSchema = WorkpadAssetSchema;

const WorkpadVariable = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  value: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.number(), _configSchema.schema.boolean()]),
  type: _configSchema.schema.string()
});

exports.WorkpadVariable = WorkpadVariable;

const WorkpadSchema = _configSchema.schema.object({
  '@created': _configSchema.schema.maybe(_configSchema.schema.string()),
  '@timestamp': _configSchema.schema.maybe(_configSchema.schema.string()),
  assets: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), WorkpadAssetSchema)),
  colors: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  css: _configSchema.schema.string(),
  variables: _configSchema.schema.arrayOf(WorkpadVariable),
  height: _configSchema.schema.number(),
  id: _configSchema.schema.string(),
  isWriteable: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  name: _configSchema.schema.string(),
  page: _configSchema.schema.number(),
  pages: _configSchema.schema.arrayOf(WorkpadPageSchema),
  width: _configSchema.schema.number()
});

exports.WorkpadSchema = WorkpadSchema;