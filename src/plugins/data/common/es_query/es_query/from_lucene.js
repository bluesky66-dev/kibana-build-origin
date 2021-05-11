"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildQueryFromLucene = buildQueryFromLucene;

var _decorate_query = require("./decorate_query");

var _lucene_string_to_dsl = require("./lucene_string_to_dsl");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function buildQueryFromLucene(queries, queryStringOptions, dateFormatTZ) {
  const combinedQueries = (queries || []).map(query => {
    const queryDsl = (0, _lucene_string_to_dsl.luceneStringToDsl)(query.query);
    return (0, _decorate_query.decorateQuery)(queryDsl, queryStringOptions, dateFormatTZ);
  });
  return {
    must: combinedQueries,
    filter: [],
    should: [],
    must_not: []
  };
}