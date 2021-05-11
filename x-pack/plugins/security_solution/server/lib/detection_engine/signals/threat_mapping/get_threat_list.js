"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThreatListCount = exports.getSortWithTieBreaker = exports.getThreatList = exports.MAX_PER_PAGE = void 0;

var _get_query_filter = require("../../../../../common/detection_engine/get_query_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This should not exceed 10000 (10k)
 */


const MAX_PER_PAGE = 9000;
exports.MAX_PER_PAGE = MAX_PER_PAGE;

const getThreatList = async ({
  callCluster,
  query,
  language,
  index,
  perPage,
  searchAfter,
  sortField,
  sortOrder,
  exceptionItems,
  threatFilters,
  listClient,
  buildRuleMessage,
  logger
}) => {
  const calculatedPerPage = perPage !== null && perPage !== void 0 ? perPage : MAX_PER_PAGE;

  if (calculatedPerPage > 10000) {
    throw new TypeError('perPage cannot exceed the size of 10000');
  }

  const queryFilter = (0, _get_query_filter.getQueryFilter)(query, language !== null && language !== void 0 ? language : 'kuery', threatFilters, index, exceptionItems);
  logger.debug(buildRuleMessage(`Querying the indicator items from the index: "${index}" with searchAfter: "${searchAfter}" for up to ${calculatedPerPage} indicator items`));
  const response = await callCluster('search', {
    body: {
      query: queryFilter,
      fields: [{
        field: '*',
        include_unmapped: true
      }],
      search_after: searchAfter,
      sort: getSortWithTieBreaker({
        sortField,
        sortOrder,
        index,
        listItemIndex: listClient.getListItemIndex()
      })
    },
    ignoreUnavailable: true,
    index,
    size: calculatedPerPage
  });
  logger.debug(buildRuleMessage(`Retrieved indicator items of size: ${response.hits.hits.length}`));
  return response;
};
/**
 * This returns the sort with a tiebreaker if we find out we are only
 * querying against the list items index. If we are querying against any
 * other index we are assuming we are 1 or more ECS compatible indexes and
 * will query against those indexes using just timestamp since we don't have
 * a tiebreaker.
 */


exports.getThreatList = getThreatList;

const getSortWithTieBreaker = ({
  sortField,
  sortOrder,
  index,
  listItemIndex
}) => {
  const ascOrDesc = sortOrder !== null && sortOrder !== void 0 ? sortOrder : 'asc';

  if (index.length === 1 && index[0] === listItemIndex) {
    if (sortField != null) {
      return [{
        [sortField]: ascOrDesc,
        tie_breaker_id: 'asc'
      }];
    } else {
      return [{
        tie_breaker_id: 'asc'
      }];
    }
  } else {
    if (sortField != null) {
      return [{
        [sortField]: ascOrDesc,
        '@timestamp': 'asc'
      }];
    } else {
      return [{
        '@timestamp': 'asc'
      }];
    }
  }
};

exports.getSortWithTieBreaker = getSortWithTieBreaker;

const getThreatListCount = async ({
  callCluster,
  query,
  language,
  threatFilters,
  index,
  exceptionItems
}) => {
  const queryFilter = (0, _get_query_filter.getQueryFilter)(query, language !== null && language !== void 0 ? language : 'kuery', threatFilters, index, exceptionItems);
  const response = await callCluster('count', {
    body: {
      query: queryFilter
    },
    ignoreUnavailable: true,
    index
  });
  return response.count;
};

exports.getThreatListCount = getThreatListCount;