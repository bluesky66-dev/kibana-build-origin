"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteTransformsRequestSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("./common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteTransformsRequestSchema = _configSchema.schema.object({
  /**
   * Delete Transform & Destination Index
   */
  transformsInfo: _configSchema.schema.arrayOf(_configSchema.schema.object({
    id: _configSchema.schema.string(),
    state: _common.transformStateSchema
  })),
  deleteDestIndex: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  deleteDestIndexPattern: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  forceDelete: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

exports.deleteTransformsRequestSchema = deleteTransformsRequestSchema;