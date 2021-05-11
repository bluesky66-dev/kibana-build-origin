"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getField = getField;
exports.addFieldToDSL = addFieldToDSL;
exports.extractPropertiesFromBucket = extractPropertiesFromBucket;

var _i18n = require("@kbn/i18n");

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../constants");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getField(indexPattern, fieldName) {
  const field = indexPattern.fields.getByName(fieldName);

  if (!field) {
    throw new Error(_i18n.i18n.translate('xpack.maps.source.esSearch.fieldNotFoundMsg', {
      defaultMessage: `Unable to find '{fieldName}' in index-pattern '{indexPatternTitle}'.`,
      values: {
        fieldName,
        indexPatternTitle: indexPattern.title
      }
    }));
  }

  return field;
}

function addFieldToDSL(dsl, field) {
  return !field.scripted ? { ...dsl,
    field: field.name
  } : { ...dsl,
    script: {
      source: field.script,
      lang: field.lang
    }
  };
}

function extractPropertiesFromBucket(bucket, ignoreKeys = []) {
  const properties = {};

  for (const key in bucket) {
    if (ignoreKeys.includes(key) || !bucket.hasOwnProperty(key)) {
      continue;
    } // todo: push these implementations in the IAggFields


    if (_lodash.default.has(bucket[key], 'value')) {
      properties[key] = bucket[key].value;
    } else if (_lodash.default.has(bucket[key], 'buckets')) {
      if (bucket[key].buckets.length === 0) {
        // No top term
        continue;
      }

      properties[key] = _lodash.default.get(bucket[key], 'buckets[0].key');
      const topBucketCount = bucket[key].buckets[0].doc_count;
      const totalCount = bucket.doc_count;

      if (totalCount && topBucketCount) {
        properties[`${key}${_constants.TOP_TERM_PERCENTAGE_SUFFIX}`] = Math.round(topBucketCount / totalCount * 100);
      }
    } else {
      if (key.startsWith(_constants.AGG_TYPE.PERCENTILE) || key.startsWith(_constants.JOIN_FIELD_NAME_PREFIX + _constants.AGG_TYPE.PERCENTILE)) {
        const values = bucket[key].values;

        for (const k in values) {
          if (values.hasOwnProperty(k)) {
            properties[key] = values[k];
            break;
          }
        }
      } else {
        properties[key] = bucket[key];
      }
    }
  }

  return properties;
}