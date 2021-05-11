"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compareFilters = exports.COMPARE_ALL_OPTIONS = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Include disabled, negate and store when comparing filters
 */
const COMPARE_ALL_OPTIONS = {
  index: true,
  disabled: true,
  negate: true,
  state: true,
  alias: true
};
exports.COMPARE_ALL_OPTIONS = COMPARE_ALL_OPTIONS;

const mapFilter = (filter, comparators, excludedAttributes) => {
  var _filter$meta, _filter$meta2;

  const cleaned = (0, _lodash.omit)(filter, excludedAttributes);
  if (comparators.index) cleaned.index = (_filter$meta = filter.meta) === null || _filter$meta === void 0 ? void 0 : _filter$meta.index;
  if (comparators.negate) cleaned.negate = filter.meta && Boolean(filter.meta.negate);
  if (comparators.disabled) cleaned.disabled = filter.meta && Boolean(filter.meta.disabled);
  if (comparators.alias) cleaned.alias = (_filter$meta2 = filter.meta) === null || _filter$meta2 === void 0 ? void 0 : _filter$meta2.alias;
  return cleaned;
};

const mapFilterArray = (filters, comparators, excludedAttributes) => {
  return (0, _lodash.map)(filters, filter => mapFilter(filter, comparators, excludedAttributes));
};
/**
 * Compare two filters or filter arrays to see if they match.
 * For filter arrays, the assumption is they are sorted.
 *
 * @param {Filter | Filter[]} first The first filter or filter array to compare
 * @param {Filter | Filter[]} second The second filter or filter array to compare
 * @param {FilterCompareOptions} comparatorOptions Parameters to use for comparison
 *
 * @returns {bool} Filters are the same
 */


const compareFilters = (first, second, comparatorOptions = {}) => {
  if (!first || !second) return false;
  let comparators = {};
  const excludedAttributes = ['$$hashKey', 'meta'];
  comparators = (0, _lodash.defaults)(comparatorOptions || {}, {
    index: false,
    state: false,
    negate: false,
    disabled: false,
    alias: false
  });
  if (!comparators.state) excludedAttributes.push('$state');

  if (Array.isArray(first) && Array.isArray(second)) {
    return (0, _lodash.isEqual)(mapFilterArray(first, comparators, excludedAttributes), mapFilterArray(second, comparators, excludedAttributes));
  } else if (!Array.isArray(first) && !Array.isArray(second)) {
    return (0, _lodash.isEqual)(mapFilter(first, comparators, excludedAttributes), mapFilter(second, comparators, excludedAttributes));
  } else {
    return false;
  }
};

exports.compareFilters = compareFilters;