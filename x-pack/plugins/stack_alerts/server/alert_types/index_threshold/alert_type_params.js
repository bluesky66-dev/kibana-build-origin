"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateComparator = validateComparator;
exports.ParamsSchema = void 0;

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


const ParamsSchema = _configSchema.schema.object({ ..._server.CoreQueryParamsSchemaProperties,
  // the comparison function to use to determine if the threshold as been met
  thresholdComparator: _configSchema.schema.string({
    validate: validateComparator
  }),
  // the values to use as the threshold; `between` and `notBetween` require
  // two values, the others require one.
  threshold: _configSchema.schema.arrayOf(_configSchema.schema.number(), {
    minSize: 1,
    maxSize: 2
  })
}, {
  validate: validateParams
});

exports.ParamsSchema = ParamsSchema;
const betweenComparators = new Set(['between', 'notBetween']); // using direct type not allowed, circular reference, so body is typed to any

function validateParams(anyParams) {
  // validate core query parts, return if it fails validation (returning string)
  const coreQueryValidated = (0, _server.validateCoreQueryBody)(anyParams);
  if (coreQueryValidated) return coreQueryValidated;
  const {
    thresholdComparator,
    threshold
  } = anyParams;

  if (betweenComparators.has(thresholdComparator) && threshold.length === 1) {
    return _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.invalidThreshold2ErrorMessage', {
      defaultMessage: '[threshold]: must have two elements for the "{thresholdComparator}" comparator',
      values: {
        thresholdComparator
      }
    });
  }
}

function validateComparator(comparator) {
  if (_lib.ComparatorFnNames.has(comparator)) return;
  return _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.invalidComparatorErrorMessage', {
    defaultMessage: 'invalid thresholdComparator specified: {comparator}',
    values: {
      comparator
    }
  });
}