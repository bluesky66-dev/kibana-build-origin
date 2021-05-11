"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildQueryFilter = exports.isQueryStringFilter = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isQueryStringFilter = filter => filter && filter.query && filter.query.query_string; // Creates a filter corresponding to a raw Elasticsearch query DSL object


exports.isQueryStringFilter = isQueryStringFilter;

const buildQueryFilter = (query, index, alias) => ({
  query,
  meta: {
    index,
    alias
  }
});

exports.buildQueryFilter = buildQueryFilter;