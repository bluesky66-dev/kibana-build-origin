"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runtimeMappingsSchema = exports.transformIdParamSchema = exports.indexPatternTitleSchema = exports.transformStateSchema = exports.transformIdsSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const transformIdsSchema = _configSchema.schema.arrayOf(_configSchema.schema.object({
  id: _configSchema.schema.string()
}));

exports.transformIdsSchema = transformIdsSchema;

const transformStateSchema = _configSchema.schema.oneOf([_configSchema.schema.literal(_constants.TRANSFORM_STATE.ABORTING), _configSchema.schema.literal(_constants.TRANSFORM_STATE.FAILED), _configSchema.schema.literal(_constants.TRANSFORM_STATE.INDEXING), _configSchema.schema.literal(_constants.TRANSFORM_STATE.STARTED), _configSchema.schema.literal(_constants.TRANSFORM_STATE.STOPPED), _configSchema.schema.literal(_constants.TRANSFORM_STATE.STOPPING)]);

exports.transformStateSchema = transformStateSchema;

const indexPatternTitleSchema = _configSchema.schema.object({
  /** Title of the index pattern for which to return stats. */
  indexPatternTitle: _configSchema.schema.string()
});

exports.indexPatternTitleSchema = indexPatternTitleSchema;

const transformIdParamSchema = _configSchema.schema.object({
  transformId: _configSchema.schema.string()
});

exports.transformIdParamSchema = transformIdParamSchema;

const runtimeMappingsSchema = _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
  type: _configSchema.schema.oneOf([_configSchema.schema.literal('keyword'), _configSchema.schema.literal('long'), _configSchema.schema.literal('double'), _configSchema.schema.literal('date'), _configSchema.schema.literal('ip'), _configSchema.schema.literal('boolean')]),
  script: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.object({
    source: _configSchema.schema.string()
  })]))
})));

exports.runtimeMappingsSchema = runtimeMappingsSchema;