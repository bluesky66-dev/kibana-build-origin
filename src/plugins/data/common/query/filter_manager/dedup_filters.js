"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dedupFilters = void 0;

var _lodash = require("lodash");

var _compare_filters = require("./compare_filters");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Combine 2 filter collections, removing duplicates
 *
 * @param {object} existingFilters - The filters to compare to
 * @param {object} filters - The filters being added
 * @param {object} comparatorOptions - Parameters to use for comparison
 *
 * @returns {object} An array of filters that were not in existing
 */
const dedupFilters = (existingFilters, filters, comparatorOptions = {}) => {
  if (!Array.isArray(filters)) {
    filters = [filters];
  }

  return (0, _lodash.filter)(filters, f => !(0, _lodash.find)(existingFilters, existingFilter => (0, _compare_filters.compareFilters)(existingFilter, f, comparatorOptions)));
};

exports.dedupFilters = dedupFilters;