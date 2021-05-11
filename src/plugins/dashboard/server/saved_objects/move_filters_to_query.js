"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moveFiltersToQuery = moveFiltersToQuery;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function isQueryFilter(filter) {
  return filter.query && !filter.meta;
}

function moveFiltersToQuery(searchSource) {
  const searchSource730 = { ...searchSource,
    filter: [],
    query: searchSource.query || {
      query: '',
      language: 'kuery'
    }
  }; // I encountered at least one export from 7.0.0-alpha that was missing the filter property in here.
  // The maps data in esarchives actually has it, but I don't know how/when they created it.

  if (!searchSource.filter) {
    searchSource.filter = [];
  }

  searchSource.filter.forEach(filter => {
    if (isQueryFilter(filter)) {
      searchSource730.query = {
        query: filter.query.query_string ? filter.query.query_string.query : '',
        language: 'lucene'
      };
    } else {
      searchSource730.filter.push(filter);
    }
  });
  return searchSource730;
}