"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostEnrollmentAPIKeyRequestSchema = exports.DeleteEnrollmentAPIKeyRequestSchema = exports.GetOneEnrollmentAPIKeyRequestSchema = exports.GetEnrollmentAPIKeysRequestSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const GetEnrollmentAPIKeysRequestSchema = {
  query: _configSchema.schema.object({
    page: _configSchema.schema.number({
      defaultValue: 1
    }),
    perPage: _configSchema.schema.number({
      defaultValue: 20
    }),
    kuery: _configSchema.schema.maybe(_configSchema.schema.string())
  })
};
exports.GetEnrollmentAPIKeysRequestSchema = GetEnrollmentAPIKeysRequestSchema;
const GetOneEnrollmentAPIKeyRequestSchema = {
  params: _configSchema.schema.object({
    keyId: _configSchema.schema.string()
  })
};
exports.GetOneEnrollmentAPIKeyRequestSchema = GetOneEnrollmentAPIKeyRequestSchema;
const DeleteEnrollmentAPIKeyRequestSchema = {
  params: _configSchema.schema.object({
    keyId: _configSchema.schema.string()
  })
};
exports.DeleteEnrollmentAPIKeyRequestSchema = DeleteEnrollmentAPIKeyRequestSchema;
const PostEnrollmentAPIKeyRequestSchema = {
  body: _configSchema.schema.object({
    name: _configSchema.schema.maybe(_configSchema.schema.string()),
    policy_id: _configSchema.schema.string(),
    expiration: _configSchema.schema.maybe(_configSchema.schema.string())
  })
};
exports.PostEnrollmentAPIKeyRequestSchema = PostEnrollmentAPIKeyRequestSchema;