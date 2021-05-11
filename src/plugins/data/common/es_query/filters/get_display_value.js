"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDisplayValueFromFilter = getDisplayValueFromFilter;

var _i18n = require("@kbn/i18n");

var _get_index_pattern_from_filter = require("./get_index_pattern_from_filter");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getValueFormatter(indexPattern, key) {
  // checking getFormatterForField exists because there is at least once case where an index pattern
  // is an object rather than an IndexPattern class
  if (!indexPattern || !indexPattern.getFormatterForField || !key) return;
  const field = indexPattern.fields.find(f => f.name === key);

  if (!field) {
    throw new Error(_i18n.i18n.translate('data.filter.filterBar.fieldNotFound', {
      defaultMessage: 'Field {key} not found in index pattern {indexPattern}',
      values: {
        key,
        indexPattern: indexPattern.title
      }
    }));
  }

  return indexPattern.getFormatterForField(field);
}

function getDisplayValueFromFilter(filter, indexPatterns) {
  if (typeof filter.meta.value === 'function') {
    const indexPattern = (0, _get_index_pattern_from_filter.getIndexPatternFromFilter)(filter, indexPatterns);
    const valueFormatter = getValueFormatter(indexPattern, filter.meta.key);
    return filter.meta.value(valueFormatter);
  } else {
    return filter.meta.value || '';
  }
}