"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildQueryFromFilters = void 0;

var _lodash = require("lodash");

var _migrate_filter = require("./migrate_filter");

var _filter_matches_index = require("./filter_matches_index");

var _filters = require("../filters");

var _handle_nested_filter = require("./handle_nested_filter");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Create a filter that can be reversed for filters with negate set
 * @param {boolean} reverse This will reverse the filter. If true then
 *                          anything where negate is set will come
 *                          through otherwise it will filter out
 * @returns {function}
 */
const filterNegate = reverse => filter => {
  if ((0, _lodash.isUndefined)(filter.meta) || (0, _lodash.isUndefined)(filter.meta.negate)) {
    return !reverse;
  }

  return filter.meta && filter.meta.negate === reverse;
};
/**
 * Translate a filter into a query to support es 5+
 * @param  {Object} filter - The filter to translate
 * @return {Object} the query version of that filter
 */


const translateToQuery = filter => {
  if (!filter) return;

  if (filter.query) {
    return filter.query;
  }

  return filter;
};

const buildQueryFromFilters = (filters = [], indexPattern, ignoreFilterIfFieldNotInIndex = false) => {
  filters = filters.filter(filter => filter && !(0, _filters.isFilterDisabled)(filter));

  const filtersToESQueries = negate => {
    return filters.filter(filterNegate(negate)).filter(filter => !ignoreFilterIfFieldNotInIndex || (0, _filter_matches_index.filterMatchesIndex)(filter, indexPattern)).map(filter => {
      return (0, _migrate_filter.migrateFilter)(filter, indexPattern);
    }).map(filter => (0, _handle_nested_filter.handleNestedFilter)(filter, indexPattern)).map(translateToQuery).map(_filters.cleanFilter);
  };

  return {
    must: [],
    filter: filtersToESQueries(false),
    should: [],
    must_not: filtersToESQueries(true)
  };
};

exports.buildQueryFromFilters = buildQueryFromFilters;