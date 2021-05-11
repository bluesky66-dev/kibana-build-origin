"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getESFilter = getESFilter;

var _filters = require("./filters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
  boolArray is the array of bool filter clauses to push filters into. Usually this would be
  the value of must, should or must_not.
  filter is the abstracted canvas filter.
*/


function getESFilter(filter) {
  if (!filter.filterType || !_filters.filters[filter.filterType]) {
    throw new Error(`Unknown filter type: ${filter.filterType}`);
  }

  try {
    return _filters.filters[filter.filterType](filter);
  } catch (e) {
    throw new Error(`Could not create elasticsearch filter from ${filter.filterType}`);
  }
}