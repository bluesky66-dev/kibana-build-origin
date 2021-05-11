"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFilterFilters = void 0;

var _lodash = require("lodash");

var _common = require("../../../../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createFilterFilters = (aggConfig, key) => {
  // have the aggConfig write agg dsl params
  const dslFilters = (0, _lodash.get)(aggConfig.toDsl(), 'filters.filters');
  const filter = dslFilters[key];
  const indexPattern = aggConfig.getIndexPattern();

  if (filter && indexPattern && indexPattern.id) {
    return (0, _common.buildQueryFilter)(filter, indexPattern.id, key);
  }
};

exports.createFilterFilters = createFilterFilters;