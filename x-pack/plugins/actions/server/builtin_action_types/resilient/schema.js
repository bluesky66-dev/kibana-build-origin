"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExecutorParamsSchema = exports.ExecutorSubActionGetSeverityParamsSchema = exports.ExecutorSubActionGetIncidentTypesParamsSchema = exports.ExecutorSubActionHandshakeParamsSchema = exports.ExecutorSubActionCommonFieldsParamsSchema = exports.ExecutorSubActionGetIncidentParamsSchema = exports.ExecutorSubActionPushParamsSchema = exports.ExecutorSubActionSchema = exports.ExternalIncidentServiceSecretConfigurationSchema = exports.ExternalIncidentServiceSecretConfiguration = exports.ExternalIncidentServiceConfigurationSchema = exports.ExternalIncidentServiceConfiguration = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ExternalIncidentServiceConfiguration = {
  apiUrl: _configSchema.schema.string(),
  orgId: _configSchema.schema.string()
};
exports.ExternalIncidentServiceConfiguration = ExternalIncidentServiceConfiguration;

const ExternalIncidentServiceConfigurationSchema = _configSchema.schema.object(ExternalIncidentServiceConfiguration);

exports.ExternalIncidentServiceConfigurationSchema = ExternalIncidentServiceConfigurationSchema;
const ExternalIncidentServiceSecretConfiguration = {
  apiKeyId: _configSchema.schema.string(),
  apiKeySecret: _configSchema.schema.string()
};
exports.ExternalIncidentServiceSecretConfiguration = ExternalIncidentServiceSecretConfiguration;

const ExternalIncidentServiceSecretConfigurationSchema = _configSchema.schema.object(ExternalIncidentServiceSecretConfiguration);

exports.ExternalIncidentServiceSecretConfigurationSchema = ExternalIncidentServiceSecretConfigurationSchema;

const ExecutorSubActionSchema = _configSchema.schema.oneOf([_configSchema.schema.literal('getIncident'), _configSchema.schema.literal('pushToService'), _configSchema.schema.literal('handshake'), _configSchema.schema.literal('incidentTypes'), _configSchema.schema.literal('severity')]);

exports.ExecutorSubActionSchema = ExecutorSubActionSchema;

const ExecutorSubActionPushParamsSchema = _configSchema.schema.object({
  incident: _configSchema.schema.object({
    name: _configSchema.schema.string(),
    description: _configSchema.schema.nullable(_configSchema.schema.string()),
    externalId: _configSchema.schema.nullable(_configSchema.schema.string()),
    incidentTypes: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.number())),
    severityCode: _configSchema.schema.nullable(_configSchema.schema.number())
  }),
  comments: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.object({
    comment: _configSchema.schema.string(),
    commentId: _configSchema.schema.string()
  })))
});

exports.ExecutorSubActionPushParamsSchema = ExecutorSubActionPushParamsSchema;

const ExecutorSubActionGetIncidentParamsSchema = _configSchema.schema.object({
  externalId: _configSchema.schema.string()
}); // Reserved for future implementation


exports.ExecutorSubActionGetIncidentParamsSchema = ExecutorSubActionGetIncidentParamsSchema;

const ExecutorSubActionCommonFieldsParamsSchema = _configSchema.schema.object({});

exports.ExecutorSubActionCommonFieldsParamsSchema = ExecutorSubActionCommonFieldsParamsSchema;

const ExecutorSubActionHandshakeParamsSchema = _configSchema.schema.object({});

exports.ExecutorSubActionHandshakeParamsSchema = ExecutorSubActionHandshakeParamsSchema;

const ExecutorSubActionGetIncidentTypesParamsSchema = _configSchema.schema.object({});

exports.ExecutorSubActionGetIncidentTypesParamsSchema = ExecutorSubActionGetIncidentTypesParamsSchema;

const ExecutorSubActionGetSeverityParamsSchema = _configSchema.schema.object({});

exports.ExecutorSubActionGetSeverityParamsSchema = ExecutorSubActionGetSeverityParamsSchema;

const ExecutorParamsSchema = _configSchema.schema.oneOf([_configSchema.schema.object({
  subAction: _configSchema.schema.literal('getFields'),
  subActionParams: ExecutorSubActionCommonFieldsParamsSchema
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('getIncident'),
  subActionParams: ExecutorSubActionGetIncidentParamsSchema
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('handshake'),
  subActionParams: ExecutorSubActionHandshakeParamsSchema
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('pushToService'),
  subActionParams: ExecutorSubActionPushParamsSchema
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('incidentTypes'),
  subActionParams: ExecutorSubActionGetIncidentTypesParamsSchema
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('severity'),
  subActionParams: ExecutorSubActionGetSeverityParamsSchema
})]);

exports.ExecutorParamsSchema = ExecutorParamsSchema;