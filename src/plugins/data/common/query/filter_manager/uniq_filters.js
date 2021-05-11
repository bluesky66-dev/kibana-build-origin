"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uniqFilters = void 0;

var _lodash = require("lodash");

var _dedup_filters = require("./dedup_filters");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Remove duplicate filters from an array of filters
 *
 * @param {array} filters The filters to remove duplicates from
 * @param {object} comparatorOptions - Parameters to use for comparison

 * @returns {object} The original filters array with duplicates removed
 */
const uniqFilters = (filters, comparatorOptions = {}) => {
  let results = [];
  (0, _lodash.each)(filters, filter => {
    results = (0, _lodash.union)(results, (0, _dedup_filters.dedupFilters)(results, [filter]), comparatorOptions);
  });
  return results;
};

exports.uniqFilters = uniqFilters;