"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildFilter = buildFilter;
exports.buildCustomFilter = buildCustomFilter;

var _ = require(".");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function buildFilter(indexPattern, field, type, negate, disabled, params, alias, store) {
  const filter = buildBaseFilter(indexPattern, field, type, params);
  filter.meta.alias = alias;
  filter.meta.negate = negate;
  filter.meta.disabled = disabled;
  filter.$state = {
    store
  };
  return filter;
}

function buildCustomFilter(indexPatternString, queryDsl, disabled, negate, alias, store) {
  const meta = {
    index: indexPatternString,
    type: _.FILTERS.CUSTOM,
    disabled,
    negate,
    alias
  };
  const filter = { ...queryDsl,
    meta
  };
  filter.$state = {
    store
  };
  return filter;
}

function buildBaseFilter(indexPattern, field, type, params) {
  switch (type) {
    case 'phrase':
      return (0, _.buildPhraseFilter)(field, params, indexPattern);

    case 'phrases':
      return (0, _.buildPhrasesFilter)(field, params, indexPattern);

    case 'range':
      const newParams = {
        gte: params.from,
        lt: params.to
      };
      return (0, _.buildRangeFilter)(field, newParams, indexPattern);

    case 'exists':
      return (0, _.buildExistsFilter)(field, indexPattern);

    default:
      throw new Error(`Unknown filter type: ${type}`);
  }
}