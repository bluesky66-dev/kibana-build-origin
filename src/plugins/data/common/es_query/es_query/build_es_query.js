"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildEsQuery = buildEsQuery;

var _lodash = require("lodash");

var _from_kuery = require("./from_kuery");

var _from_filters = require("./from_filters");

var _from_lucene = require("./from_lucene");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * @param indexPattern
 * @param queries - a query object or array of query objects. Each query has a language property and a query property.
 * @param filters - a filter object or array of filter objects
 * @param config - an objects with query:allowLeadingWildcards and query:queryString:options UI
 * settings in form of { allowLeadingWildcards, queryStringOptions }
 * config contains dateformat:tz
 */
function buildEsQuery(indexPattern, queries, filters, config = {
  allowLeadingWildcards: false,
  queryStringOptions: {},
  ignoreFilterIfFieldNotInIndex: false
}) {
  queries = Array.isArray(queries) ? queries : [queries];
  filters = Array.isArray(filters) ? filters : [filters];
  const validQueries = queries.filter(query => (0, _lodash.has)(query, 'query'));
  const queriesByLanguage = (0, _lodash.groupBy)(validQueries, 'language');
  const kueryQuery = (0, _from_kuery.buildQueryFromKuery)(indexPattern, queriesByLanguage.kuery, config.allowLeadingWildcards, config.dateFormatTZ);
  const luceneQuery = (0, _from_lucene.buildQueryFromLucene)(queriesByLanguage.lucene, config.queryStringOptions, config.dateFormatTZ);
  const filterQuery = (0, _from_filters.buildQueryFromFilters)(filters, indexPattern, config.ignoreFilterIfFieldNotInIndex);
  return {
    bool: {
      must: [...kueryQuery.must, ...luceneQuery.must, ...filterQuery.must],
      filter: [...kueryQuery.filter, ...luceneQuery.filter, ...filterQuery.filter],
      should: [...kueryQuery.should, ...luceneQuery.should, ...filterQuery.should],
      must_not: [...kueryQuery.must_not, ...luceneQuery.must_not, ...filterQuery.must_not]
    }
  };
}