"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineFieldsAndAggs = combineFieldsAndAggs;
exports.sortFields = sortFields;

var _fields = require("../types/fields");

var _common = require("../../../../../src/plugins/data/common");

var _aggregation_types = require("../constants/aggregation_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// cross reference fields and aggs.
// fields contain a list of aggs that are compatible, and vice versa.


function combineFieldsAndAggs(fields, aggs, rollupFields) {
  const keywordFields = getKeywordFields(fields);
  const textFields = getTextFields(fields);
  const numericalFields = getNumericalFields(fields);
  const ipFields = getIpFields(fields);
  const geoFields = getGeoFields(fields);
  const isRollup = Object.keys(rollupFields).length > 0;
  const mix = mixFactory(isRollup, rollupFields);
  aggs.forEach(a => {
    if (a.type === _fields.METRIC_AGG_TYPE && a.fields !== undefined) {
      switch (a.id) {
        case _aggregation_types.ML_JOB_AGGREGATION.LAT_LONG:
          geoFields.forEach(f => mix(f, a));
          break;

        case _aggregation_types.ML_JOB_AGGREGATION.INFO_CONTENT:
        case _aggregation_types.ML_JOB_AGGREGATION.HIGH_INFO_CONTENT:
        case _aggregation_types.ML_JOB_AGGREGATION.LOW_INFO_CONTENT:
          textFields.forEach(f => mix(f, a));

        case _aggregation_types.ML_JOB_AGGREGATION.DISTINCT_COUNT:
        case _aggregation_types.ML_JOB_AGGREGATION.HIGH_DISTINCT_COUNT:
        case _aggregation_types.ML_JOB_AGGREGATION.LOW_DISTINCT_COUNT:
          // distinct count (i.e. cardinality) takes keywords, ips
          // as well as numerical fields
          keywordFields.forEach(f => mix(f, a));
          ipFields.forEach(f => mix(f, a));
        // note, no break to fall through to add numerical fields.

        default:
          // all other aggs take numerical fields
          numericalFields.forEach(f => {
            mix(f, a);
          });
          break;
      }
    }
  });
  return {
    aggs,
    fields: isRollup ? filterFields(fields) : fields
  };
} // remove fields that have no aggs associated to them, unless they are date fields


function filterFields(fields) {
  return fields.filter(f => f.aggs && (f.aggs.length > 0 || f.aggs.length === 0 && f.type === _common.ES_FIELD_TYPES.DATE));
} // returns a mix function that is used to cross-reference aggs and fields.
// wrapped in a provider to allow filtering based on rollup job capabilities


function mixFactory(isRollup, rollupFields) {
  return function mix(field, agg) {
    if (isRollup === false || rollupFields[field.id] && rollupFields[field.id].find(f => f.agg === agg.dslName)) {
      if (field.aggs !== undefined) {
        field.aggs.push(agg);
      }

      if (agg.fields !== undefined) {
        agg.fields.push(field);
      }
    }
  };
}

function getKeywordFields(fields) {
  return fields.filter(f => f.type === _common.ES_FIELD_TYPES.KEYWORD);
}

function getTextFields(fields) {
  return fields.filter(f => f.type === _common.ES_FIELD_TYPES.TEXT);
}

function getIpFields(fields) {
  return fields.filter(f => f.type === _common.ES_FIELD_TYPES.IP);
}

function getNumericalFields(fields) {
  return fields.filter(f => f.type === _common.ES_FIELD_TYPES.LONG || f.type === _common.ES_FIELD_TYPES.UNSIGNED_LONG || f.type === _common.ES_FIELD_TYPES.INTEGER || f.type === _common.ES_FIELD_TYPES.SHORT || f.type === _common.ES_FIELD_TYPES.BYTE || f.type === _common.ES_FIELD_TYPES.DOUBLE || f.type === _common.ES_FIELD_TYPES.FLOAT || f.type === _common.ES_FIELD_TYPES.HALF_FLOAT || f.type === _common.ES_FIELD_TYPES.SCALED_FLOAT);
}

function getGeoFields(fields) {
  return fields.filter(f => f.type === _common.ES_FIELD_TYPES.GEO_POINT || f.type === _common.ES_FIELD_TYPES.GEO_SHAPE);
}
/**
 * Sort fields by name, keeping event rate at the beginning
 */


function sortFields(fields) {
  if (fields.length === 0) {
    return fields;
  }

  let eventRate;

  if (fields[0].id === _fields.EVENT_RATE_FIELD_ID) {
    [eventRate] = fields.splice(0, 1);
  }

  fields.sort((a, b) => a.name.localeCompare(b.name));

  if (eventRate !== undefined) {
    fields.splice(0, 0, eventRate);
  }

  return fields;
}