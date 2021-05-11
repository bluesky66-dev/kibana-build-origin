"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PackagePolicySchema = exports.UpdatePackagePolicySchema = exports.NewPackagePolicySchema = exports.NamespaceSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const NamespaceSchema = _configSchema.schema.string({
  minLength: 1,
  validate: value => {
    const namespaceValidation = (0, _common.isValidNamespace)(value || '');

    if (!namespaceValidation.valid && namespaceValidation.error) {
      return namespaceValidation.error;
    }
  }
});

exports.NamespaceSchema = NamespaceSchema;

const ConfigRecordSchema = _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
  type: _configSchema.schema.maybe(_configSchema.schema.string()),
  value: _configSchema.schema.maybe(_configSchema.schema.any())
}));

const PackagePolicyBaseSchema = {
  name: _configSchema.schema.string(),
  description: _configSchema.schema.maybe(_configSchema.schema.string()),
  namespace: NamespaceSchema,
  policy_id: _configSchema.schema.string(),
  enabled: _configSchema.schema.boolean(),
  package: _configSchema.schema.maybe(_configSchema.schema.object({
    name: _configSchema.schema.string(),
    title: _configSchema.schema.string(),
    version: _configSchema.schema.string()
  })),
  output_id: _configSchema.schema.string(),
  inputs: _configSchema.schema.arrayOf(_configSchema.schema.object({
    type: _configSchema.schema.string(),
    enabled: _configSchema.schema.boolean(),
    vars: _configSchema.schema.maybe(ConfigRecordSchema),
    config: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
      type: _configSchema.schema.maybe(_configSchema.schema.string()),
      value: _configSchema.schema.maybe(_configSchema.schema.any())
    }))),
    streams: _configSchema.schema.arrayOf(_configSchema.schema.object({
      id: _configSchema.schema.maybe(_configSchema.schema.string()),
      // BWC < 7.11
      enabled: _configSchema.schema.boolean(),
      data_stream: _configSchema.schema.object({
        dataset: _configSchema.schema.string(),
        type: _configSchema.schema.string()
      }),
      vars: _configSchema.schema.maybe(ConfigRecordSchema),
      config: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
        type: _configSchema.schema.maybe(_configSchema.schema.string()),
        value: _configSchema.schema.maybe(_configSchema.schema.any())
      })))
    }))
  }))
};

const NewPackagePolicySchema = _configSchema.schema.object({ ...PackagePolicyBaseSchema
});

exports.NewPackagePolicySchema = NewPackagePolicySchema;

const UpdatePackagePolicySchema = _configSchema.schema.object({ ...PackagePolicyBaseSchema,
  version: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.UpdatePackagePolicySchema = UpdatePackagePolicySchema;

const PackagePolicySchema = _configSchema.schema.object({ ...PackagePolicyBaseSchema,
  id: _configSchema.schema.string(),
  version: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.PackagePolicySchema = PackagePolicySchema;