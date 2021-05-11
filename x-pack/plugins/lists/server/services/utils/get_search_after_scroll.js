"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSearchAfterScroll = void 0;

var _get_query_filter = require("./get_query_filter");

var _get_sort_with_tie_breaker = require("./get_sort_with_tie_breaker");

var _get_source_with_tie_breaker = require("./get_source_with_tie_breaker");

var _get_search_after_with_tie_breaker = require("./get_search_after_with_tie_breaker");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getSearchAfterScroll = async ({
  callCluster,
  filter,
  hopSize,
  hops,
  searchAfter,
  sortField,
  sortOrder,
  index
}) => {
  const query = (0, _get_query_filter.getQueryFilter)({
    filter
  });
  let newSearchAfter = searchAfter;

  for (let i = 0; i < hops; ++i) {
    const response = await callCluster('search', {
      body: {
        _source: (0, _get_source_with_tie_breaker.getSourceWithTieBreaker)({
          sortField
        }),
        query,
        search_after: newSearchAfter,
        sort: (0, _get_sort_with_tie_breaker.getSortWithTieBreaker)({
          sortField,
          sortOrder
        })
      },
      ignoreUnavailable: true,
      index,
      size: hopSize
    });

    if (response.hits.hits.length > 0) {
      newSearchAfter = (0, _get_search_after_with_tie_breaker.getSearchAfterWithTieBreaker)({
        response,
        sortField
      });
    } else {
      return {
        searchAfter: undefined,
        validSearchAfterFound: false
      };
    }
  }

  return {
    searchAfter: newSearchAfter,
    validSearchAfterFound: true
  };
};

exports.getSearchAfterScroll = getSearchAfterScroll;