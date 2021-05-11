"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateCoreQueryBody = validateCoreQueryBody;
exports.validateGroupBy = validateGroupBy;
exports.validateTimeWindowUnits = validateTimeWindowUnits;
exports.CoreQueryParamsSchemaProperties = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// common properties on time_series_query and alert_type_params


const CoreQueryParamsSchemaProperties = {
  // name of the indices to search
  index: _configSchema.schema.oneOf([_configSchema.schema.string({
    minLength: 1
  }), _configSchema.schema.arrayOf(_configSchema.schema.string({
    minLength: 1
  }), {
    minSize: 1
  })]),
  // field in index used for date/time
  timeField: _configSchema.schema.string({
    minLength: 1
  }),
  // aggregation type
  aggType: _configSchema.schema.string({
    validate: validateAggType
  }),
  // aggregation field
  aggField: _configSchema.schema.maybe(_configSchema.schema.string({
    minLength: 1
  })),
  // how to group
  groupBy: _configSchema.schema.string({
    validate: validateGroupBy
  }),
  // field to group on (for groupBy: top)
  termField: _configSchema.schema.maybe(_configSchema.schema.string({
    minLength: 1
  })),
  // limit on number of groups returned
  termSize: _configSchema.schema.maybe(_configSchema.schema.number({
    min: 1
  })),
  // size of time window for date range aggregations
  timeWindowSize: _configSchema.schema.number({
    min: 1
  }),
  // units of time window for date range aggregations
  timeWindowUnit: _configSchema.schema.string({
    validate: validateTimeWindowUnits
  })
};
exports.CoreQueryParamsSchemaProperties = CoreQueryParamsSchemaProperties;

const CoreQueryParamsSchema = _configSchema.schema.object(CoreQueryParamsSchemaProperties); // Meant to be used in a "subclass"'s schema body validator, so the
// anyParams object is assumed to have been validated with the schema
// above.
// Using direct type not allowed, circular reference, so body is typed to unknown.


function validateCoreQueryBody(anyParams) {
  const {
    aggType,
    aggField,
    groupBy,
    termField,
    termSize
  } = anyParams;

  if (aggType !== 'count' && !aggField) {
    return _i18n.i18n.translate('xpack.triggersActionsUI.data.coreQueryParams.aggTypeRequiredErrorMessage', {
      defaultMessage: '[aggField]: must have a value when [aggType] is "{aggType}"',
      values: {
        aggType
      }
    });
  } // check grouping


  if (groupBy === 'top') {
    if (termField == null) {
      return _i18n.i18n.translate('xpack.triggersActionsUI.data.coreQueryParams.termFieldRequiredErrorMessage', {
        defaultMessage: '[termField]: termField required when [groupBy] is top'
      });
    }

    if (termSize == null) {
      return _i18n.i18n.translate('xpack.triggersActionsUI.data.coreQueryParams.termSizeRequiredErrorMessage', {
        defaultMessage: '[termSize]: termSize required when [groupBy] is top'
      });
    }

    if (termSize > _index.MAX_GROUPS) {
      return _i18n.i18n.translate('xpack.triggersActionsUI.data.coreQueryParams.invalidTermSizeMaximumErrorMessage', {
        defaultMessage: '[termSize]: must be less than or equal to {maxGroups}',
        values: {
          maxGroups: _index.MAX_GROUPS
        }
      });
    }
  }
}

const AggTypes = new Set(['count', 'avg', 'min', 'max', 'sum']);

function validateAggType(aggType) {
  if (AggTypes.has(aggType)) {
    return;
  }

  return _i18n.i18n.translate('xpack.triggersActionsUI.data.coreQueryParams.invalidAggTypeErrorMessage', {
    defaultMessage: 'invalid aggType: "{aggType}"',
    values: {
      aggType
    }
  });
}

function validateGroupBy(groupBy) {
  if (groupBy === 'all' || groupBy === 'top') {
    return;
  }

  return _i18n.i18n.translate('xpack.triggersActionsUI.data.coreQueryParams.invalidGroupByErrorMessage', {
    defaultMessage: 'invalid groupBy: "{groupBy}"',
    values: {
      groupBy
    }
  });
}

const TimeWindowUnits = new Set(['s', 'm', 'h', 'd']);

function validateTimeWindowUnits(timeWindowUnit) {
  if (TimeWindowUnits.has(timeWindowUnit)) {
    return;
  }

  return _i18n.i18n.translate('xpack.triggersActionsUI.data.coreQueryParams.invalidTimeWindowUnitsErrorMessage', {
    defaultMessage: 'invalid timeWindowUnit: "{timeWindowUnit}"',
    values: {
      timeWindowUnit
    }
  });
}