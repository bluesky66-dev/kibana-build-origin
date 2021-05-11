"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaseExecutorParamsSchema = exports.ExecutorSubActionAddCommentParamsSchema = exports.ExecutorSubActionUpdateParamsSchema = exports.ExecutorSubActionCreateParamsSchema = exports.ConnectorSchema = exports.ConnectorProps = exports.CommentSchema = exports.CaseConfigurationSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _api = require("../../../common/api");

var _validators = require("./validators");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Reserved for future implementation


const CaseConfigurationSchema = _configSchema.schema.object({});

exports.CaseConfigurationSchema = CaseConfigurationSchema;

const ContextTypeUserSchema = _configSchema.schema.object({
  type: _configSchema.schema.literal(_api.CommentType.user),
  comment: _configSchema.schema.string()
});

const ContextTypeAlertGroupSchema = _configSchema.schema.object({
  type: _configSchema.schema.literal(_api.CommentType.generatedAlert),
  alerts: _configSchema.schema.string()
});

const ContextTypeAlertSchema = _configSchema.schema.object({
  type: _configSchema.schema.literal(_api.CommentType.alert),
  // allowing either an array or a single value to preserve the previous API of attaching a single alert ID
  alertId: _configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string()), _configSchema.schema.string()]),
  index: _configSchema.schema.string(),
  rule: _configSchema.schema.object({
    id: _configSchema.schema.nullable(_configSchema.schema.string()),
    name: _configSchema.schema.nullable(_configSchema.schema.string())
  })
});

const CommentSchema = _configSchema.schema.oneOf([ContextTypeUserSchema // ContextTypeAlertSchema,
// ContextTypeAlertGroupSchema,
]);

exports.CommentSchema = CommentSchema;

const JiraFieldsSchema = _configSchema.schema.object({
  issueType: _configSchema.schema.string(),
  priority: _configSchema.schema.nullable(_configSchema.schema.string()),
  parent: _configSchema.schema.nullable(_configSchema.schema.string())
});

const ResilientFieldsSchema = _configSchema.schema.object({
  incidentTypes: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  severityCode: _configSchema.schema.nullable(_configSchema.schema.string())
});

const ServiceNowITSMFieldsSchema = _configSchema.schema.object({
  impact: _configSchema.schema.nullable(_configSchema.schema.string()),
  severity: _configSchema.schema.nullable(_configSchema.schema.string()),
  urgency: _configSchema.schema.nullable(_configSchema.schema.string()),
  category: _configSchema.schema.nullable(_configSchema.schema.string()),
  subcategory: _configSchema.schema.nullable(_configSchema.schema.string())
});

const ServiceNowSIRFieldsSchema = _configSchema.schema.object({
  destIp: _configSchema.schema.nullable(_configSchema.schema.boolean()),
  sourceIp: _configSchema.schema.nullable(_configSchema.schema.boolean()),
  malwareHash: _configSchema.schema.nullable(_configSchema.schema.boolean()),
  malwareUrl: _configSchema.schema.nullable(_configSchema.schema.boolean()),
  priority: _configSchema.schema.nullable(_configSchema.schema.string()),
  category: _configSchema.schema.nullable(_configSchema.schema.string()),
  subcategory: _configSchema.schema.nullable(_configSchema.schema.string())
});

const NoneFieldsSchema = _configSchema.schema.nullable(_configSchema.schema.object({}));

const ReducedConnectorFieldsSchema = {
  '.jira': JiraFieldsSchema,
  '.resilient': ResilientFieldsSchema,
  '.servicenow-sir': ServiceNowSIRFieldsSchema
};
const ConnectorProps = {
  id: _configSchema.schema.string(),
  name: _configSchema.schema.string(),
  type: _configSchema.schema.oneOf([_configSchema.schema.literal('.servicenow'), _configSchema.schema.literal('.jira'), _configSchema.schema.literal('.resilient'), _configSchema.schema.literal('.servicenow-sir'), _configSchema.schema.literal('.none')]),
  // Chain of conditional schemes
  fields: Object.keys(ReducedConnectorFieldsSchema).reduce((conditionalSchema, key) => _configSchema.schema.conditional(_configSchema.schema.siblingRef('type'), key, ReducedConnectorFieldsSchema[key], conditionalSchema), _configSchema.schema.conditional(_configSchema.schema.siblingRef('type'), '.servicenow', ServiceNowITSMFieldsSchema, NoneFieldsSchema))
};
exports.ConnectorProps = ConnectorProps;

const ConnectorSchema = _configSchema.schema.object(ConnectorProps);

exports.ConnectorSchema = ConnectorSchema;
const CaseBasicProps = {
  description: _configSchema.schema.string(),
  title: _configSchema.schema.string(),
  tags: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  connector: _configSchema.schema.object(ConnectorProps, {
    validate: _validators.validateConnector
  }),
  settings: _configSchema.schema.object({
    syncAlerts: _configSchema.schema.boolean()
  })
};
const CaseUpdateRequestProps = {
  id: _configSchema.schema.string(),
  version: _configSchema.schema.string(),
  description: _configSchema.schema.nullable(CaseBasicProps.description),
  title: _configSchema.schema.nullable(CaseBasicProps.title),
  tags: _configSchema.schema.nullable(CaseBasicProps.tags),
  connector: _configSchema.schema.nullable(CaseBasicProps.connector),
  settings: _configSchema.schema.nullable(CaseBasicProps.settings),
  status: _configSchema.schema.nullable(_configSchema.schema.string())
};
const CaseAddCommentRequestProps = {
  caseId: _configSchema.schema.string(),
  comment: CommentSchema
};

const ExecutorSubActionCreateParamsSchema = _configSchema.schema.object(CaseBasicProps);

exports.ExecutorSubActionCreateParamsSchema = ExecutorSubActionCreateParamsSchema;

const ExecutorSubActionUpdateParamsSchema = _configSchema.schema.object(CaseUpdateRequestProps);

exports.ExecutorSubActionUpdateParamsSchema = ExecutorSubActionUpdateParamsSchema;

const ExecutorSubActionAddCommentParamsSchema = _configSchema.schema.object(CaseAddCommentRequestProps);

exports.ExecutorSubActionAddCommentParamsSchema = ExecutorSubActionAddCommentParamsSchema;

const CaseExecutorParamsSchema = _configSchema.schema.oneOf([_configSchema.schema.object({
  subAction: _configSchema.schema.literal('create'),
  subActionParams: ExecutorSubActionCreateParamsSchema
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('update'),
  subActionParams: ExecutorSubActionUpdateParamsSchema
}), _configSchema.schema.object({
  subAction: _configSchema.schema.literal('addComment'),
  subActionParams: ExecutorSubActionAddCommentParamsSchema
})]);

exports.CaseExecutorParamsSchema = CaseExecutorParamsSchema;