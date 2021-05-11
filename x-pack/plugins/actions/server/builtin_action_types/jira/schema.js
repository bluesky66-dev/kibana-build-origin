"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExecutorParamsSchema = exports.ExecutorSubActionGetIssueParamsSchema = exports.ExecutorSubActionGetIssuesParamsSchema = exports.ExecutorSubActionGetFieldsByIssueTypeParamsSchema = exports.ExecutorSubActionGetIssueTypesParamsSchema = exports.ExecutorSubActionGetCapabilitiesParamsSchema = exports.ExecutorSubActionHandshakeParamsSchema = exports.ExecutorSubActionCommonFieldsParamsSchema = exports.ExecutorSubActionGetIncidentParamsSchema = exports.ExecutorSubActionPushParamsSchema = exports.ExecutorSubActionSchema = exports.ExternalIncidentServiceSecretConfigurationSchema = exports.ExternalIncidentServiceSecretConfiguration = exports.ExternalIncidentServiceConfigurationSchema = exports.ExternalIncidentServiceConfiguration = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ExternalIncidentServiceConfiguration = {
  apiUrl: _configSchema.schema.string(),
  projectKey: _configSchema.schema.string()
};
exports.ExternalIncidentServiceConfiguration = ExternalIncidentServiceConfiguration;

const ExternalIncidentServiceConfigurationSchema = _configSchema.schema.object(ExternalIncidentServiceConfiguration);

exports.ExternalIncidentServiceConfigurationSchema = ExternalIncidentServiceConfigurationSchema;
const ExternalIncidentServiceSecretConfiguration = {
  email: _configSchema.schema.string(),
  apiToken: _configSchema.schema.string()
};
exports.ExternalIncidentServiceSecretConfiguration = ExternalIncidentServiceSecretConfiguration;

const ExternalIncidentServiceSecretConfigurationSchema = _configSchema.schema.object(ExternalIncidentServiceSecretConfiguration);

exports.ExternalIncidentServiceSecretConfigurationSchema = ExternalIncidentServiceSecretConfigurationSchema;

const ExecutorSubActionSchema = _configSchema.schema.oneOf([_configSchema.schema.literal('getIncident'), _configSchema.schema.literal('pushToService'), _configSchema.schema.literal('handshake'), _configSchema.schema.literal('issueTypes'), _configSchema.schema.literal('fieldsByIssueType')]);

exports.ExecutorSubActionSchema = ExecutorSubActionSchema;

const ExecutorSubActionPushParamsSchema = _configSchema.schema.object({
  incident: _configSchema.schema.object({
    summary: _configSchema.schema.string(),
    description: _configSchema.schema.nullable(_configSchema.schema.string()),
    externalId: _configSchema.schema.nullable(_configSchema.schema.string()),
    issueType: _configSchema.schema.nullable(_configSchema.schema.string()),
    priority: _configSchema.schema.nullable(_configSchema.schema.string()),
    labels: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.string({
      validate: label => // Matches any space, tab or newline character.
      label.match(/\s/g) ? `The label ${label} cannot contain spaces` : undefined
    }))),
    parent: _configSchema.schema.nullable(_configSchema.schema.string())
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

const ExecutorSubActionGetCapabilitiesParamsSchema = _configSchema.schema.object({});

exports.ExecutorSubActionGetCapabilitiesParamsSchema = ExecutorSubActionGetCapabilitiesParamsSchema;

const ExecutorSubActionGetIssueTypesParamsSchema = _configSchema.schema.object({});

exports.ExecutorSubActionGetIssueTypesParamsSchema = ExecutorSubActionGetIssueTypesParamsSchema;

const ExecutorSubActionGetFieldsByIssueTypeParamsSchema = _configSchema.schema.object({
  id: _configSchema.schema.string()
});

exports.ExecutorSubActionGetFieldsByIssueTypeParamsSchema = ExecutorSubActionGetFieldsByIssueTypeParamsSchema;

const ExecutorSubActionGetIssuesParamsSchema = _configSchema.schema.object({
  title: _configSchema.schema.string()
});

exports.ExecutorSubActionGetIssuesParamsSchema = ExecutorSubActionGetIssuesParamsSchema;

const ExecutorSubActionGetIssueParamsSchema = _configSchema.schema.object({
  id: _configSchema.schema.string()
});

exports.ExecutorSubActionGetIssueParamsSchema = ExecutorSubActionGetIssueParamsSchema;

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
  subAction: _configSchema.schema.literal('issueTypes'),
  subActionParams: ExecutorSubActionGetIssueTypesParamsSchema
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('fieldsByIssueType'),
  subActionParams: ExecutorSubActionGetFieldsByIssueTypeParamsSchema
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('issues'),
  subActionParams: ExecutorSubActionGetIssuesParamsSchema
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('issue'),
  subActionParams: ExecutorSubActionGetIssueParamsSchema
})]);

exports.ExecutorParamsSchema = ExecutorParamsSchema;