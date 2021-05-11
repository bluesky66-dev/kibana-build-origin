"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterIdSchema = exports.updateFilterSchema = exports.createFilterSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createFilterSchema = _configSchema.schema.object({
  filterId: _configSchema.schema.string(),
  description: _configSchema.schema.maybe(_configSchema.schema.string()),
  items: _configSchema.schema.arrayOf(_configSchema.schema.string())
});

exports.createFilterSchema = createFilterSchema;

const updateFilterSchema = _configSchema.schema.object({
  description: _configSchema.schema.maybe(_configSchema.schema.string()),
  addItems: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  removeItems: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
});

exports.updateFilterSchema = updateFilterSchema;

const filterIdSchema = _configSchema.schema.object({
  /**
   * ID of the filter
   */
  filterId: _configSchema.schema.string()
});

exports.filterIdSchema = filterIdSchema;