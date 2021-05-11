"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListWithKuerySchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ListWithKuerySchema = _configSchema.schema.object({
  page: _configSchema.schema.maybe(_configSchema.schema.number({
    defaultValue: 1
  })),
  perPage: _configSchema.schema.maybe(_configSchema.schema.number({
    defaultValue: 20
  })),
  sortField: _configSchema.schema.maybe(_configSchema.schema.string()),
  sortOrder: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('desc'), _configSchema.schema.literal('asc')])),
  showUpgradeable: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  kuery: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.any() // KueryNode
  ]))
});

exports.ListWithKuerySchema = ListWithKuerySchema;