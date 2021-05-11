"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signalParamsSchema = exports.signalSchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const signalSchema = _configSchema.schema.object({
  anomalyThreshold: _configSchema.schema.maybe(_configSchema.schema.number()),
  author: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  }),
  buildingBlockType: _configSchema.schema.nullable(_configSchema.schema.string()),
  description: _configSchema.schema.string(),
  note: _configSchema.schema.nullable(_configSchema.schema.string()),
  eventCategoryOverride: _configSchema.schema.maybe(_configSchema.schema.string()),
  falsePositives: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  }),
  from: _configSchema.schema.string(),
  ruleId: _configSchema.schema.string(),
  immutable: _configSchema.schema.boolean({
    defaultValue: false
  }),
  index: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  language: _configSchema.schema.nullable(_configSchema.schema.string()),
  license: _configSchema.schema.nullable(_configSchema.schema.string()),
  outputIndex: _configSchema.schema.nullable(_configSchema.schema.string()),
  savedId: _configSchema.schema.nullable(_configSchema.schema.string()),
  timelineId: _configSchema.schema.nullable(_configSchema.schema.string()),
  timelineTitle: _configSchema.schema.nullable(_configSchema.schema.string()),
  meta: _configSchema.schema.nullable(_configSchema.schema.object({}, {
    unknowns: 'allow'
  })),
  machineLearningJobId: _configSchema.schema.maybe(_configSchema.schema.string()),
  query: _configSchema.schema.nullable(_configSchema.schema.string()),
  filters: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.object({}, {
    unknowns: 'allow'
  }))),
  maxSignals: _configSchema.schema.number({
    defaultValue: _constants.DEFAULT_MAX_SIGNALS
  }),
  riskScore: _configSchema.schema.number(),
  // TODO: Specify types explicitly since they're known?
  riskScoreMapping: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.object({}, {
    unknowns: 'allow'
  }))),
  ruleNameOverride: _configSchema.schema.nullable(_configSchema.schema.string()),
  severity: _configSchema.schema.string(),
  severityMapping: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.object({}, {
    unknowns: 'allow'
  }))),
  threat: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.object({}, {
    unknowns: 'allow'
  }))),
  threshold: _configSchema.schema.maybe(_configSchema.schema.object({
    // Can be an empty string (pre-7.12) or empty array (7.12+)
    field: _configSchema.schema.nullable(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string(), {
      maxSize: 3
    })])),
    // Always required
    value: _configSchema.schema.number(),
    // Can be null (pre-7.12) or empty array (7.12+)
    cardinality: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.object({
      field: _configSchema.schema.string(),
      value: _configSchema.schema.number()
    }), {
      maxSize: 1
    }))
  })),
  timestampOverride: _configSchema.schema.nullable(_configSchema.schema.string()),
  to: _configSchema.schema.string(),
  type: _configSchema.schema.string(),
  references: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  }),
  version: _configSchema.schema.number({
    defaultValue: 1
  }),
  lists: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({}, {
    unknowns: 'allow'
  }))),
  // For backwards compatibility with customers that had a data bug in 7.7. Once we use a migration script please remove this.
  exceptions_list: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({}, {
    unknowns: 'allow'
  }))),
  // For backwards compatibility with customers that had a data bug in 7.8. Once we use a migration script please remove this.
  exceptionsList: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({}, {
    unknowns: 'allow'
  }))),
  threatFilters: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.object({}, {
    unknowns: 'allow'
  }))),
  threatIndex: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  threatIndicatorPath: _configSchema.schema.maybe(_configSchema.schema.string()),
  threatQuery: _configSchema.schema.maybe(_configSchema.schema.string()),
  threatMapping: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({}, {
    unknowns: 'allow'
  }))),
  threatLanguage: _configSchema.schema.maybe(_configSchema.schema.string()),
  concurrentSearches: _configSchema.schema.maybe(_configSchema.schema.number()),
  itemsPerSearch: _configSchema.schema.maybe(_configSchema.schema.number())
});
/**
 * This is the schema for the Alert Rule that represents the SIEM alert for signals
 * that index into the .siem-signals-${space-id}
 */


exports.signalSchema = signalSchema;

const signalParamsSchema = () => signalSchema;

exports.signalParamsSchema = signalParamsSchema;