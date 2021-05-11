"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateComparator = validateComparator;
exports.EsQueryAlertParamsSchema = exports.EsQueryAlertParamsSchemaProperties = exports.ES_QUERY_MAX_HITS_PER_EXECUTION = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _lib = require("../lib");

var _server = require("../../../../triggers_actions_ui/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ES_QUERY_MAX_HITS_PER_EXECUTION = 10000; // alert type parameters

exports.ES_QUERY_MAX_HITS_PER_EXECUTION = ES_QUERY_MAX_HITS_PER_EXECUTION;
const EsQueryAlertParamsSchemaProperties = {
  index: _configSchema.schema.arrayOf(_configSchema.schema.string({
    minLength: 1
  }), {
    minSize: 1
  }),
  timeField: _configSchema.schema.string({
    minLength: 1
  }),
  esQuery: _configSchema.schema.string({
    minLength: 1
  }),
  size: _configSchema.schema.number({
    min: 0,
    max: ES_QUERY_MAX_HITS_PER_EXECUTION
  }),
  timeWindowSize: _configSchema.schema.number({
    min: 1
  }),
  timeWindowUnit: _configSchema.schema.string({
    validate: _server.validateTimeWindowUnits
  }),
  threshold: _configSchema.schema.arrayOf(_configSchema.schema.number(), {
    minSize: 1,
    maxSize: 2
  }),
  thresholdComparator: _configSchema.schema.string({
    validate: validateComparator
  })
};
exports.EsQueryAlertParamsSchemaProperties = EsQueryAlertParamsSchemaProperties;

const EsQueryAlertParamsSchema = _configSchema.schema.object(EsQueryAlertParamsSchemaProperties, {
  validate: validateParams
});

exports.EsQueryAlertParamsSchema = EsQueryAlertParamsSchema;
const betweenComparators = new Set(['between', 'notBetween']); // using direct type not allowed, circular reference, so body is typed to any

function validateParams(anyParams) {
  const {
    esQuery,
    thresholdComparator,
    threshold
  } = anyParams;

  if (betweenComparators.has(thresholdComparator) && threshold.length === 1) {
    return _i18n.i18n.translate('xpack.stackAlerts.esQuery.invalidThreshold2ErrorMessage', {
      defaultMessage: '[threshold]: must have two elements for the "{thresholdComparator}" comparator',
      values: {
        thresholdComparator
      }
    });
  }

  try {
    const parsedQuery = JSON.parse(esQuery);

    if (parsedQuery && !parsedQuery.query) {
      return _i18n.i18n.translate('xpack.stackAlerts.esQuery.missingEsQueryErrorMessage', {
        defaultMessage: '[esQuery]: must contain "query"'
      });
    }
  } catch (err) {
    return _i18n.i18n.translate('xpack.stackAlerts.esQuery.invalidEsQueryErrorMessage', {
      defaultMessage: '[esQuery]: must be valid JSON'
    });
  }
}

function validateComparator(comparator) {
  if (_lib.ComparatorFnNames.has(comparator)) return;
  return _i18n.i18n.translate('xpack.stackAlerts.esQuery.invalidComparatorErrorMessage', {
    defaultMessage: 'invalid thresholdComparator specified: {comparator}',
    values: {
      comparator
    }
  });
}