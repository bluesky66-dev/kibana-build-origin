"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tutorialSchema = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const PARAM_TYPES = {
  NUMBER: 'number',
  STRING: 'string'
};
const TUTORIAL_CATEGORY = {
  LOGGING: 'logging',
  SECURITY_SOLUTION: 'security solution',
  METRICS: 'metrics',
  OTHER: 'other'
};

const dashboardSchema = _joi.default.object({
  id: _joi.default.string().required(),
  // Dashboard saved object id
  linkLabel: _joi.default.string().when('isOverview', {
    is: true,
    then: _joi.default.required()
  }),
  // Is this an Overview / Entry Point dashboard?
  isOverview: _joi.default.boolean().required()
});

const artifactsSchema = _joi.default.object({
  // Fields present in Elasticsearch documents created by this product.
  exportedFields: _joi.default.object({
    documentationUrl: _joi.default.string().required()
  }),
  // Kibana dashboards created by this product.
  dashboards: _joi.default.array().items(dashboardSchema).required(),
  application: _joi.default.object({
    path: _joi.default.string().required(),
    label: _joi.default.string().required()
  })
});

const statusCheckSchema = _joi.default.object({
  title: _joi.default.string(),
  text: _joi.default.string(),
  btnLabel: _joi.default.string(),
  success: _joi.default.string(),
  error: _joi.default.string(),
  esHitsCheck: _joi.default.object({
    index: _joi.default.alternatives().try(_joi.default.string(), _joi.default.array().items(_joi.default.string())).required(),
    query: _joi.default.object().required()
  }).required()
});

const instructionSchema = _joi.default.object({
  title: _joi.default.string(),
  textPre: _joi.default.string(),
  commands: _joi.default.array().items(_joi.default.string().allow('')),
  textPost: _joi.default.string()
});

const instructionVariantSchema = _joi.default.object({
  id: _joi.default.string().required(),
  instructions: _joi.default.array().items(instructionSchema).required()
});

const instructionSetSchema = _joi.default.object({
  title: _joi.default.string(),
  callOut: _joi.default.object({
    title: _joi.default.string().required(),
    message: _joi.default.string(),
    iconType: _joi.default.string()
  }),
  // Variants (OSes, languages, etc.) for which tutorial instructions are specified.
  instructionVariants: _joi.default.array().items(instructionVariantSchema).required(),
  statusCheck: statusCheckSchema
});

const paramSchema = _joi.default.object({
  defaultValue: _joi.default.required(),
  id: _joi.default.string().regex(/^[a-zA-Z_]+$/).required(),
  label: _joi.default.string().required(),
  type: _joi.default.string().valid(Object.values(PARAM_TYPES)).required()
});

const instructionsSchema = _joi.default.object({
  instructionSets: _joi.default.array().items(instructionSetSchema).required(),
  params: _joi.default.array().items(paramSchema)
});

const tutorialSchema = {
  id: _joi.default.string().regex(/^[a-zA-Z0-9-]+$/).required(),
  category: _joi.default.string().valid(Object.values(TUTORIAL_CATEGORY)).required(),
  name: _joi.default.string().required(),
  moduleName: _joi.default.string(),
  isBeta: _joi.default.boolean().default(false),
  shortDescription: _joi.default.string().required(),
  euiIconType: _joi.default.string(),
  // EUI icon type string, one of https://elastic.github.io/eui/#/icons
  longDescription: _joi.default.string().required(),
  completionTimeMinutes: _joi.default.number().integer(),
  previewImagePath: _joi.default.string(),
  // kibana and elastic cluster running on prem
  onPrem: instructionsSchema.required(),
  // kibana and elastic cluster running in elastic's cloud
  elasticCloud: instructionsSchema,
  // kibana running on prem and elastic cluster running in elastic's cloud
  onPremElasticCloud: instructionsSchema,
  // Elastic stack artifacts produced by product when it is setup and run.
  artifacts: artifactsSchema,
  // saved objects used by data module.
  savedObjects: _joi.default.array().items(),
  savedObjectsInstallMsg: _joi.default.string()
};
exports.tutorialSchema = tutorialSchema;