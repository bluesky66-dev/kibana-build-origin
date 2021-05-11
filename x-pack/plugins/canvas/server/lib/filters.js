"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.time = time;
exports.luceneQueryString = luceneQueryString;
exports.exactly = exactly;
exports.filters = void 0;

var _types = require("../../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 TODO: This could be pluggable
*/


const isTimeFilter = maybeTimeFilter => {
  return maybeTimeFilter.filterType === _types.FilterType.time;
};

const isLuceneFilter = maybeLuceneFilter => {
  return maybeLuceneFilter.filterType === _types.FilterType.luceneQueryString;
};

const isExactlyFilter = maybeExactlyFilter => {
  return maybeExactlyFilter.filterType === _types.FilterType.exactly;
};

function time(filter) {
  if (!isTimeFilter(filter) || !filter.column) {
    throw new Error('column is required for Elasticsearch range filters');
  }

  return {
    range: {
      [filter.column]: {
        gte: filter.from,
        lte: filter.to
      }
    }
  };
}

function luceneQueryString(filter) {
  if (!isLuceneFilter(filter)) {
    throw new Error('Filter is not a lucene filter');
  }

  return {
    query_string: {
      query: filter.query || '*'
    }
  };
}

function exactly(filter) {
  if (!isExactlyFilter(filter)) {
    throw new Error('Filter is not an exactly filter');
  }

  return {
    term: {
      [filter.column]: {
        value: filter.value
      }
    }
  };
}

const filters = {
  exactly,
  time,
  luceneQueryString
};
exports.filters = filters;